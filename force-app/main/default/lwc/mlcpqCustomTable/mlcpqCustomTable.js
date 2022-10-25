/**
 * @description Controller Custom data table <br>
 * @group UI Controller & Services
 */

import LightningDatatable from 'lightning/datatable';
import combobox from './combobox'
// import mlcpqCustomTable from './mlcpqCustomTable'

export default class CustomLightningDatatable extends LightningDatatable {
    static customTypes = {
        combobox: {
            template: combobox,
            typeAttributes: ['options', 'value', 'row', 'product'],
            standardCellLayout: true
        }
    }

    onPriceSelect(event) {
        console.log(event);
    }
}