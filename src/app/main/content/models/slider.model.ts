export class Slider {
  id: number;
  name: string;
  image: Image;
  description: string;
  constructor(slider?) {
    slider = slider || {};
    this.name = slider.name || "";
    this.description = slider.description || "";
  }
}

export class Image {
  content_type: string;
  base64String: string;
  type: string;
  id: number;
  constructor(image?) {
    image = image || {};
    this.content_type = image.content_type || "";
    this.base64String = image.base64String || "";
    this.type = image.type || "";
    this.id = image.id || -1;
  }
}
