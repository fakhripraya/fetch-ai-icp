import express, { Request } from "express";
import { kosan } from './const/kosan';
import { IKosan, IKosanDBObject }  from './interface/kosan';

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(
    cors({
      origin: '*',
      credentials: true,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );

app.get("/", async (req: Request, res: any) => {
    const response = {
      success: true,
      lastChecked: new Date().toISOString(),
    };
  res.json(response);
});

app.post("/kosan", async (req: Request, res: any) => {
  const object: IKosan = req.body;

  console.log("isi object", object)

  // Filter kosan list with includes logic
  const recommendationKosan = kosan.filter((k: IKosanDBObject) => {
    let match = false;
    if (object.location && k.location.toLowerCase().includes(object.location.toLowerCase())) {

      if (object.name && k.name.toLowerCase().includes(object.name.toLowerCase())) {
        match = true;
      }
      if (object.priceRange && k.price <= object.priceRange +100000 && k.price >= object.priceRange-100000) {
        match = true;
      }
      if (object.facility && k.facility.toLowerCase().includes(object.facility.toLowerCase())){
        match = true;
      }
    }

    return match;
  });

  console.log("isi rekomendasi : ", recommendationKosan)
  res.status(200).json(recommendationKosan);
});

app.get("/kosan",  async (req: Request, res) =>{
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  // find kosan by id
  const kosanDetail = kosan.find((k: IKosanDBObject) => k.id === (id));

  if (!kosanDetail) {
    return res.status(404).json({ message: "kosan not found" });
  }

  res.status(200).json(kosanDetail);
});



app.use(express.static("/dist"));
app.listen();