import Replicate from "replicate-js";

const replicate = new Replicate({
  token: "d08f9cff7015954843993c90c96f1a87c9a52652",
});

import type { NextApiRequest, NextApiResponse } from "next";

export type Prediction = {
  prediction: string[];
  success: boolean;
  error?: string;
};

const Generate = async (
  req: NextApiRequest,
  res: NextApiResponse<Prediction>
) => {
  // Process a POST request
  if (req.method === "POST") {
    try {
      const helloWorldModel = await replicate.models.get(
        "stability-ai/stable-diffusion"
      );

      // const dalleMiniModel = await replicate.models.get("kuprel/min-dalle");

      const prediction = await helloWorldModel.predict({
        prompt: req.body.text,
      });

      console.log("prediction", prediction);
      return res.json({
        success: prediction && prediction.length!!,
        prediction,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";

      console.log("Error:", errorMessage, err);

      return res.status(500).json({
        success: false,
        prediction: [],
        error: "Generation error, perhaps NSFW content?",
      });
    }
  } else {
    // Handle any other HTTP method
    return res.status(500).json({
      success: false,
      prediction: [],
    });
  }
};

export default Generate;
