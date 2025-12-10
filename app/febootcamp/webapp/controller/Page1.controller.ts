
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";  
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

export default class Page1 extends Controller {

   public onInit(): void{
       
        this.getView()?.setModel(new JSONModel());
        const oModel = this.getOwnerComponent()?.getModel() as  ODataModel;
        this.sUrl  = oModel.getServiceUrl();
       
        this.getBooks();
    }
 
    public onInit(): void{
        const oModel = this.getOwnerComponent()?.getModel() as  ODataModel;
        this.sUrl  = oModel.getServiceUrl();
        console.log("hello");
        this.getBooks();
    }
 
    public async getBooks() {
        try {
            console.log("hello");
 
            const response = await fetch(this.sUrl + "Books", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
 
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
 
            const data = await response.json();
            console.log(data);
 
            interface Books {
                BorrowerName: string;
                BookTitle: number;
            }
 
            const dataArray = data.value as Books[];
 
            const mapped = dataArray.map(item => ({
                borrowerName: item.BorrowerName,
                bookTitle: item.UnitsInStock
            }));
 
            const oView = this.getView();
            if (oView) {
                oView.setModel(new JSONModel({ Products: mapped }));
            }
        } catch (error) {
            console.error("Error fetching Products:", error);
        }
    }
  }