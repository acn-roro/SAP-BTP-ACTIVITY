import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";


export default class Page2 extends Controller {

    public onNavBack(): void {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RoutePage1");
  }
}