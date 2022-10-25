import { LightningElement, api, track } from 'lwc';


export default class MlcpqPaginator extends LightningElement {
    @api pageNumber;
    @api pageSize;
    @api totalItems;
    @api rowOffset;

    @track fromItem;
    @track toItem;
    @track numberOfPages;
    @track prevDisabled;
    @track nextDisabled;

    connectedCallback() {
        this.calculateUI();
    }

    renderedCallback() {
       // this.calculateUI();
    }

    onNext() {
        this.pageNumber++;
        this.rowOffset = this.rowOffset + 10;
        this.triggerEvent();
    }

    onFirst() {
        this.pageNumber = 0;
        this.rowOffset = 0;
        this.triggerEvent();
    }

    onPrev() {
        this.pageNumber--;
        this.rowOffset = this.rowOffset - 10;
        this.triggerEvent();
    }

    onLast() {
        this.pageNumber = this.numberOfPages;
        this.rowOffset = parseInt(this.totalItems / 10, 10) * 10;
        this.triggerEvent();
    }

    calculateUI() {
        this.fromItem = this.pageNumber * this.pageSize + 1;
        this.toItem = this.fromItem + this.pageSize - 1;
        if (this.toItem > this.totalItems) {
            this.toItem = this.totalItems;
        }
        this.numberOfPages = Math.floor(this.totalItems / this.pageSize);
        if ((this.numberOfPages + 1) * this.pageSize < this.totalItems) {
            this.numberOfPages++;
        }
        this.prevDisabled = this.pageNumber === 0;
        this.nextDisabled = this.pageNumber >= this.numberOfPages;
    }

    triggerEvent() {
        this.calculateUI();
        this.dispatchEvent(new CustomEvent('pagechanged', {
            detail: {
                pageNumber: this.pageNumber,
                rowOffset: this.rowOffset,
                pageSize: this.pageSize
            },
        }));
    }

    @api
    setPage(pageNumber) {
        this.pageNumber = pageNumber;
        this.calculateUI();
    }
}