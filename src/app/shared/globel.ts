import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { HttpHeaders } from "@angular/common/http";

export class GLOBAL {
  // public static USER_API = "http://127.0.0.1:8080/api/auth/";
  public static USER_IMAGE_API = "http://124.109.39.22:18089/onlineappshopapi";
  // public static USER_API = "http://5b5ea035.ngrok.io/api/auth/";
  public static USER_API =
    "http://124.109.39.22:18089/onlineappshopapi/public/api/auth/";
  public static LEVELS = [
    { id: 1, name: "Silver" },
    { id: 2, name: "Gold" },
    { id: 3, name: "Platinum" }
  ];

  public static STATUS = [
    { id: 1, name: "created" },
    { id: 2, name: "accepted" },
    { id: 3, name: "in-progress" },
    { id: 4, name: "dispatched" },
    { id: 5, name: "delivered" },
    { id: 6, name: "closed" }
  ];

  public static DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: GLOBAL.USER_API + "drop-image",
    maxFilesize: 2, // size MB
    acceptedFiles: "image/png, image/jpeg",
    headers: {
      "Content-Type": "application/json",
    },
    createImageThumbnails: true,
    clickable: true,
    addRemoveLinks: true
  };
}
