import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { ImageController } from "../../../server/controllers/imageController";

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        return await ImageController.handleGenerateImage(request);
      },
    },
  },
});
