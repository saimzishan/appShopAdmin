export class GLOBAL {
  // public static USER_API = "http://127.0.0.1:8080/api/auth/";
  public static USER_IMAGE_API = "http://124.109.39.22:18089/onlineappshopapi";
  // public static USER_API = "http://99ba594d.ngrok.io/api/auth/";
  public static USER_API = "http://124.109.39.22:18089/onlineappshopapi/public/api/auth/";
  public static LEVELS = [
      {id: 1, name: 'Silver'},
      {id: 2, name: 'Gold'},
      {id: 3, name: 'Platinum'}
  ];

  public static STATUS = [
    {id: 1, name: 'created'},
    {id: 2, name: 'accepted'},
    {id: 3, name: 'in-progress'},
    {id: 4, name: 'dispatched'},
    {id: 5, name: 'delivered'},
    {id: 6, name: 'closed'}
];
}
