import type { NextApiRequest, NextApiResponse } from "next";

const NFT = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const uri = req.query.uri; // ipfs://QmVecHA2BKCqVQdkrZJTz6eMcpvi5TaeizxjPz6thvoL56

    if (typeof uri !== "string") {
      return res.status(500).json({ success: false });
    }

    try {
      const contentId = uri.replace("ipfs://", "");

      const data = await fetch(`https://ipfs.io/ipfs/${contentId}`).then((t) =>
        t.json()
      );

      console.log(data);

      if (!data || !data.image) {
        return res.status(500).json({ success: false });
      }

      res.redirect(data.image);

      //   const image = await fetch(data.image).then((t) => t.arrayBuffer());

      //   console.log(image);

      //   if (image) {
      //     res.writeHead(200, { "Content-Type": "image/png" });
      //     res.end(image, "binary");
      //     return;
      //   }
    } catch (error) {
      return res.status(500).json({ success: false });
    }
  } else {
    // Handle any other HTTP method
    return res.status(500).json({ success: false });
  }
};

export default NFT;
