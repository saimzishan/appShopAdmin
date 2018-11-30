import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";

export class GLOBAL {
  // public static USER_API = "http://18.217.12.17/api/public/api/auth/";
  // public static USER_API = "http://www.econowholesale.com/api/public/api/auth/";
  public static USER_API =
  "http://124.109.39.22:18089/onlineappshopapi/public/api/auth/";
  // public static USER_API = "http://bf75ebc2.ngrok.io/api/auth/";
  // public static USER_API = "http://2dcc3b88.ngrok.io/api/auth/";
  // public static USER_API =
  // "http://127.0.0.1:8000/api/auth/";

  // public static USER_IMAGE_API = "http://18.217.12.17/api";
  // public static USER_IMAGE_API = "http://www.econowholesale.com/api";
  public static USER_IMAGE_API = "http://124.109.39.22:18089/onlineappshopapi";
  // public static USER_IMAGE_API = "http://bf75ebc2.ngrok.io/api";

  public static LEVELS = [
    { id: 1, name: "Silver" },
    { id: 2, name: "Gold" },
    { id: 3, name: "Platinum" }
  ];

  public static STATUS = [
    { id: 1, name: "created" },
    { id: 2, name: "approved" },
    { id: 3, name: "in-progress" },
    { id: 4, name: "full-fill" },
    { id: 5, name: "canceled" }
  ];

  public static DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: GLOBAL.USER_API + "drop-image",
    maxFilesize: 2, // size MB
    acceptedFiles: "image/png, image/jpeg",
    headers: {
      "Content-Type": "application/json"
    },
    createImageThumbnails: true,
    clickable: true,
    addRemoveLinks: true,
    maxFiles: 5
  };

  public static DEFAULT_DROPZONE_CONFIG_FOR_BRAND: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: GLOBAL.USER_API + "drop-image",
    maxFilesize: 2, // size MB
    maxFiles: 1,
    init: function() {
      this.on("maxfilesexceeded", function(file) {
        this.removeAllFiles();
        this.addFile(file);
      });
    },
    acceptedFiles: "image/png, image/jpeg",
    headers: {
      "Content-Type": "application/json"
    },
    createImageThumbnails: true,
    clickable: true,
    addRemoveLinks: true
  };

  public static DEFAULT_DROPZONE_CONFIG_FOR_BULK_PRODUCT: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: GLOBAL.USER_API + "drop-image",
    // maxFilesize: 2, // size MB
    maxFiles: 1,
    init: function() {
      this.on("maxfilesexceeded", function(file) {
        this.removeAllFiles();
        this.addFile(file);
      });
    },
    acceptedFiles: ".csv",
    headers: {
      "Content-Type": "application/json"
    },
    // createImageThumbnails: true,
    clickable: true,
    addRemoveLinks: true
  };
}
