from uagents import Agent, Context
import time
from domain.entities.rest.rest import Request, Response,RequestIdKosan,ResponseGetKosan


from utils.functions import process_query,call_get_kosan

agent = Agent(
    name='test-ICP-agent',
    port=8001,
    mailbox=True,
    endpoint=["http://127.0.0.1:8001/submit"]
)

@agent.on_rest_post("/chat/submit", Request, Response)
async def handle_submit_chat(ctx: Context, req: Request) -> Response:
    ctx.logger.info(f"Received POST request with text: {req.text}")
    try:
        # Call your LLM + tool process pipeline
        resultLLM, resultArray = await process_query(req.text, ctx)

        return Response(
            result=resultLLM,
            resultArray=resultArray,
            agent_address=ctx.agent.address,
            timestamp=int(time.time()),
        )
    except Exception as e:
        ctx.logger.error(f"Error in /chat/submit: {str(e)}")
        return Response(
            text=f"Error: {str(e)}",
            agent_address=ctx.agent.address,
            timestamp=int(time.time()),
        )


@agent.on_rest_post("/kosan", RequestIdKosan,ResponseGetKosan)
async def handle_submit_chat(ctx: Context, req: RequestIdKosan) -> ResponseGetKosan:
    ctx.logger.info(f"Received POST request with id: {req.idKosan}")
    try:
        # Call your LLM + tool process pipeline
        response= await call_get_kosan(req.idKosan, ctx)
        ctx.logger.info(f"res {response}")
        return ResponseGetKosan(
            result=response,
            agent_address=ctx.agent.address,
            timestamp=int(time.time()),
        )
    except Exception as e:
        ctx.logger.error(f"Error in kosan: {str(e)}")
        return ResponseGetKosan(
            text=f"Error: {str(e)}",
            agent_address=ctx.agent.address,
            timestamp=int(time.time()),
        )
if __name__ == "__main__":
    agent.run()