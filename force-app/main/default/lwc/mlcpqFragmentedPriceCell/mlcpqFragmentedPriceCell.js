import { LightningElement, api } from 'lwc';

export default class MlcpqFragmentedPriceCell extends LightningElement  {
    @api options;
    @api value;
    @api row;
    @api product;

    onPriceSelect(event) {
        const eventData = {
            newValue: event.detail.value,
            oldVaule: this.value,
            product: this.product,
            row: this.row
        }
        const changeEvent = new CustomEvent('fragmentedpricechange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: eventData
        });
        this.dispatchEvent(changeEvent);
    }
}