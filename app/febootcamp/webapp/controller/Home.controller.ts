import Controller from "sap/ui/core/mvc/Controller";
import MessageBox from "sap/m/MessageBox";


/**
 * @namespace febootcamp.controller
 */
export default class Home extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    
public onButtonPress(): void {
        MessageBox.confirm("This button is working, yey!", {
            title: "Success" // Add your desired title here
        });
    }
}
