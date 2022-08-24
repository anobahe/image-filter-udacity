import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Router, Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    //Validating the image_url query
    if ( !image_url ) {
      return res.status(400).send(`image_url is required`);
    }

    // Handling error
    try {
      const filteredpath = await filterImageFromURL(image_url);

      await res.status(200).sendFile(filteredpath, {}, (err) => {
        if (err) {
          return res.status(422).send(`Unable to process image`);
        }
        deleteLocalFiles([filteredpath]);
      });
    }

    catch (err) {
      res.status(422).send(`Kindly crosscheck the image_url`);
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();