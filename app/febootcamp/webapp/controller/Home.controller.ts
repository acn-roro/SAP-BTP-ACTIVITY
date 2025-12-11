import Controller from "sap/ui/core/mvc/Controller";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace febootcamp.controller
 */
export default class Home extends Controller {

    /* eslint-disable @typescript-eslint/no-empty-function */

    public onSuccessMessageBoxPress(): void {
        MessageBox.success(
            "The button is working, yey!"
        );
    }
}