import requests
import json
from uagents import Context
from domain.entities.building.building import Building
from domain.constants import ASI1_BASE_URL, ASI1_HEADERS, HEADERS,CANISTER_URI
from utils.tools import tools

async def call_icp_endpoint(func_name: str, args: dict, ctx: Context):
    if func_name == "get_boarding_house_details":
        ctx.logger.info(f"Calling get_boarding_house_details with args: {args}")
        url = f"{CANISTER_URI}/kosan"
        if "priceRange" in args and isinstance(args["priceRange"], str):
            try:
                args["priceRange"] = int(args["priceRange"])
            except ValueError:
                ctx.logger.warning("priceRange is not a valid int, leaving as is")
        ctx.logger.info(f'get number : {args["priceRange"]}')
        response = requests.post(url, headers=HEADERS, json=args)
    else:

        raise ValueError(f"Unsupported function call: {func_name}")
    
    response.raise_for_status()

    # Parse JSON into Building model
    return response.json()


async def call_get_kosan(query: str, ctx):
    # build URL with query params
    url = f"{CANISTER_URI}/kosan?id={query}"

    ctx.logger.info(f"Calling get_kosan with args: {query} and uri = {url}")

    try:
        response = requests.get(url)
        response.raise_for_status()

        # return parsed JSON
        ctx.logger.info(f"isi data {response.json()}")
        return response.json()

    except requests.RequestException as e:
        raise ValueError(f"Error fetching kosan data: {e}")

async def process_query(query: str, ctx: Context) -> str:
    result = [] 
    try:
        query = build_prompt(query=query)

        # Step 1: Initial call to ASI1 with user query and tools
        initial_message = {
            "role": "user",
            "content": query
        }
        payload = {
            "model": "asi1-mini",
            "messages": [initial_message],
            "tools": tools,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=payload
        )
        response.raise_for_status()
        response_json = response.json()

        # Step 2: Parse tool calls from response
        tool_calls = response_json["choices"][0]["message"].get("tool_calls", [])
        messages_history = [initial_message, response_json["choices"][0]["message"]]

        # Step 3: If tools used, execute tools, format results, and send results back to ASI1 for final answer
        if tool_calls:
            for tool_call in tool_calls:
                func_name = tool_call["function"]["name"]
                arguments = json.loads(tool_call["function"]["arguments"])
                tool_call_id = tool_call["id"]

                ctx.logger.info(f"Executing {func_name} with arguments: {arguments}")

                try:
                    result= await call_icp_endpoint(func_name, arguments,ctx)
                    content_to_send = json.dumps(result)
                except Exception as e:
                    error_content = {
                        "error": f"Tool execution failed: {str(e)}",
                        "status": "failed"
                    }
                    content_to_send = json.dumps(error_content)

                tool_result_message = {
                    "role": "tool",
                    "tool_call_id": tool_call_id,
                    "content": content_to_send
                }
                messages_history.append(tool_result_message)

            final_payload = {
                "model": "asi1-mini",
                "messages": messages_history,
                "temperature": 0.7,
                "max_tokens": 1024
            }

            final_response = requests.post(
                f"{ASI1_BASE_URL}/chat/completions",
                headers=ASI1_HEADERS,
                json=final_payload
            )
            final_response.raise_for_status()
            final_response_json = final_response.json()
            return final_response_json["choices"][0]["message"]["content"], result
        else:
            return response_json["choices"][0]["message"]["content"], []

    except Exception as e:
        ctx.logger.error(f"Error processing query: {str(e)}")
        return f"An error occurred while processing your request: {str(e)}",[]

def build_prompt(query: str) -> str:
    return f"""
You are an assistant specialized in helping users find boarding houses.
When a user asks about a boarding house, you MUST call the provided tool 
`get_boarding_house_building_details` to retrieve details such as facilities if the user doesnt provide the facilities then dont ask it, 
pricing(for pricing its only use rupiah), and owner contact details. 

If the user provides an address (or partial address), use it in the tool call otherwise dont ask again.
If the name or price range is mentioned, include them as well.
so if the user doest provide it just get the data they provide

Always respond with tool calls first, and only summarize or answer after 
tool results are received.

btw if user use english then answer english and if user use indonesia then use indonesia

User query: {query}
"""