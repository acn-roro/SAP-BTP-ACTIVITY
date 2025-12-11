
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";  
import ODataModel from "sap/ui/model/odata/v4/ODataModel"
import Context from "sap/ui/model/odata/v4/Context";

export default class Page1 extends Controller {
    public onNavBack(): void {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteHome");
  } 

    public onGoToPage2(): void {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RoutePage2");
  }

    public onButtonPress(): void {
   
        MessageBox.show("Nice to meet you!", {
            title: "Hello World",
            icon: MessageBox.Icon.NONE,  
            actions: [MessageBox.Action.OK],
        });
    }

   public onInit(): void{
    const oData = {};
        const oModel = new JSONModel(oData);
        this.getView()!.setModel(oModel);
        this.getBooks();
    }
    public async getBooks(): Promise<any> {
    const oModel = this.getOwnerComponent()!.getModel() as ODataModel;
 
    if (!oModel) {
      console.error("Model 'mainService' not found. Check manifest.json.");
      return;
    }
 
    const oBinding = oModel.bindList("/Products");
 
    try {
      // Explicitly request contexts: start at 0, fetch 100 rows
      const aContexts: Context[] = await oBinding.requestContexts(0, 100);
 
      const aData = aContexts.map(ctx => ctx.getObject());
      const productDetails = aData.map(Products => ({
        productName: Products.ProductName, unitsOnOrder: Products.UnitsOnOrder
      }));
 
      const oView = this.getView();
      if (oView) {
          oView.setModel(new JSONModel({ 
            Products: productDetails 
          }));
      }
 
      console.log(productDetails)
 
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }
 
}