
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";

export default class Page1 extends Controller {


  public onButtonPress(): void {
    MessageBox.show("Nice to meet you!", {
      title: "Hello World",
           icon: MessageBox.Icon.NONE,
      actions: [MessageBox.Action.OK],
    });
  }
    public onGoToPage2(): void {
        const router = UIComponent.getRouterFor(this);
       router.navTo("RoutePage2"); 

    };
  }
