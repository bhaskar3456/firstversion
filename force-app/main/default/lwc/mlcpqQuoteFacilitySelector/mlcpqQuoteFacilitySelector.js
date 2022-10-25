/**
 * @description Controller for Select page <br>
 * @group UI Controller & Services
 * @author aMind Solutions
 */

import { LightningElement, track, wire, api } from 'lwc';
import createQuoteLineLocation from '@salesforce/apex/MLCPQ_SubscriptionManagerController.createQuoteLineLocation';
import deleteQuoteLineLocation from '@salesforce/apex/MLCPQ_SubscriptionManagerController.deleteQuoteLineLocation';
import getAccountLines from '@salesforce/apex/MLCPQ_SubscriptionManagerController.getAccountLinesWithQLLocations';
import getProductsForAdd from '@salesforce/apex/MLCPQ_SubscriptionManagerController.getProductsForAdd';
import onAddProduct from '@salesforce/apex/MLCPQ_SubscriptionManagerController.onAddProduct';
import getQuoteLineLocationsByCareType from '@salesforce/apex/MLCPQ_SubscriptionManagerController.getUniqueProductsFromQuoteLineLocationsByCareType';
import priceFragmentationChanged from '@salesforce/apex/MLCPQ_SubscriptionManagerController.priceFragmentationChanged';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class MLCPQ_QuoteEdit extends LightningElement {
    @api quoteId;
    @api careType;
    @api accountId;
    @api showIcons;
    @track columns;
    @track qllData;

    @track isLoading = false;
    @track products = [];
    @track pageSize = 10;
    @track pageNumber = 0;
    @track totalItems = 0;
    @track showPager = false
    @track sortField = 'FacilityId__c';
    @track isAscending = true;
    @track sortDirection = 'asc';
    @track rowOffset = 0;
    tempColumns = []
    product2QL = {};
    productsForAdd = [];
    product2Column = {};
    productMap = {};
    quoteModel = null;
    actionToIcon = {
        'Add': 'utility:arrowup',
        'New': 'utility:arrowup',
        'Existing': 'utility:sync',
        'Remove': 'utility:arrowdown',
        'Cancel': 'utility:arrowdown',
        'Change': 'utility:up',
    }


    connectedCallback() {
        this.loadData();
    }

    @api
    async loadData(filterData) {
        this.isLoading = true;
        if (filterData) {
            this.pageNumber = filterData.selectedPage;
            this.isAscending = filterData.selectedSortDirection;
            this.sortField = filterData.selectedSortField;
            this.sortDirection = this.isAscending ? 'asc' : 'desc';
            const paginator = this.template.querySelector('c-mlcpq-paginator');
            if (paginator) {
                paginator.setPage(this.pageNumber);
            }
        }
        try {
            // Load columns and products first time only
            this.log({accountId: this.accountId, quoteId: this.quoteId, careType: this.careType,  pageNumber: this.pageNumber, pageSize: this.pageSize});
            const [accountData, backendColumns, productsForAdd] = await Promise.all ([
                getAccountLines({accountId: this.accountId, quoteId: this.quoteId, careType: this.careType, pageNumber: this.pageNumber, pageSize: this.pageSize, sortField: this.sortField, isAscending: this.isAscending}),
                this.tempColumns.length === 0 ? getQuoteLineLocationsByCareType({quoteId: this.quoteId, careType: this.careType}) : [],
                this.productsForAdd.length === 0? getProductsForAdd({quoteId: this.quoteId}) : this.productsForAdd
            ]);
            this.productsForAdd = productsForAdd;
            this.log({accountData, backendColumns, productsForAdd});
            const accountLines = accountData!=null?accountData.accountLines:null;
            this.totalItems = accountData!=null?accountData.totalNumberOfRecords:null;
            this.showPager = this.totalItems > 0;

            if (this.tempColumns.length === 0) {
                for (let i in backendColumns) {
                    const productId = this.processId(backendColumns[i].productId);
                    this.tempColumns.push({
                        quoteLines: backendColumns[i].relatedQuoteLines,
                        maintenanceMode: backendColumns[i].maintenanceMode,
                        SBQQ__Product__c: productId,
                        SBQQ__Product__r: {
                            Id: productId,
                            Name: backendColumns[i].productName
                        }
                    })
                }
            }

            const productIds = [];
            this.product2QL = [];
            this.product2Column = {};
            for (let i in this.tempColumns) {
                const productId = this.processId(this.tempColumns[i].SBQQ__Product__c);
                this.product2Column[productId] = this.tempColumns[i];
                if (!productIds.includes(productId)) {
                    productIds.push(productId);
                    this.product2QL[productId] = this.tempColumns[i].quoteLines;
                    this.productMap[productId] = this.tempColumns[i].SBQQ__Product__r;
                }
            }

            const products = [];
            for (let i in productsForAdd) {
                products.push({
                    label: productsForAdd[i].Name,
                    value: this.processId(productsForAdd[i].Id),
                })
            }
            this.products = products.filter((product) => {
                return !productIds.includes(product.value);
            });

            const cols = [
                {label: 'FAC ID', fieldName: 'FacilityId__c', editable: false, fixedWidth: 100, sortable : true},
                {label: 'FAC Name', fieldName: 'Name', editable: false, fixedWidth: 450, sortable : true},
            ];

            for (let i in productIds) {
                const isFragmented = this.product2QL[productIds[i]].length > 1;
                const options = [{
                    label: 'None',
                    value: ''
                }];
                for(let j in this.product2QL[productIds[i]]) {
                    options.push({
                        // label: this.product2QL[productIds[i]][j].SBQQ__SpecialPrice__c,
                        label: this.product2QL[productIds[i]][j].Disc_Unit_Price__c,
                        value: this.product2QL[productIds[i]][j].Id
                    });
                }
                cols.push({
                    label: this.productMap[productIds[i]].Name,
                    fieldName: `${productIds[i]}`,
                    editable: true,
                    type: isFragmented ? 'combobox' : 'boolean',
                    initialWidth: this.calculateWidth(this.productMap[productIds[i]].Name),
                    typeAttributes: {
                       options,
                       value: {
                           fieldName: productIds[i]
                       },
                        row: {
                           fieldName: `index`
                       },
                        product: productIds[i]
                    },
                    cellAttributes: {
                        alignment: 'center',
                        class: {
                            fieldName: `${productIds[i]}class`
                        },
                        iconName: { fieldName: `${productIds[i]}icon`}
                    },
                })
            }

            for (let i in accountLines) {
                const qLLs = accountLines[i].Quote_Line_Locations__r;
                accountLines[i].qLLMap = {};
                accountLines[i]['index'] = i;
                accountLines[i].maintenanceMode = (accountLines[i].Subscription_Type__c === 'Maintenance Mode');

                for (let j in qLLs) {
                    const productId = this.processId(qLLs[j].MLCPQ_Product__c);
                    accountLines[i].qLLMap[productId] = qLLs[j];
                }

                for (let j in productIds) {
                    const isFragmented = this.product2QL[productIds[j]].length > 1;
                    const productId = this.processId(productIds[j]);
                    accountLines[i][productId + 'class'] = 'slds-theme_shade ' +  (isFragmented ? ' cell-combo' : '') +
                        (this.product2Column[productId].maintenanceMode === accountLines[i].maintenanceMode || accountLines[i].qLLMap[productId] ? '' : ' disabled');
                    accountLines[i][productIds[j]] = isFragmented ? '' : false;
                    accountLines[i][productId + 'icon'] = null;
                }

                for (let j in qLLs) {
                    const productId = this.processId(qLLs[j].MLCPQ_Product__c);
                    const isFragmented = this.product2QL[productId].length > 1;

                    accountLines[i].qLLMap[productId] = qLLs[j];
                    if (qLLs[j].MLCPQ_Action_Type__c !== 'Remove' && !accountLines[i][productId + 'class'].includes('disabled')) {
                        accountLines[i][productId] = isFragmented ? qLLs[j].MLCPQ_Quote_Line__c : true;
                    } else {
                        accountLines[i][productId] = '';
                    }


                    if (this.showIcons && !accountLines[i][productId + 'class'].includes('disabled')) {
                        if ('Existing' !== qLLs[j].MLCPQ_Action_Type__c) {
                            accountLines[i][productId + 'icon'] = this.actionToIcon[qLLs[j].MLCPQ_Action_Type__c];
                        } else {
                            if (qLLs[j].MLCPQ_Operational_Status__c && qLLs[j].MLCPQ_Operational_Status__c !== 'Active') {
                                accountLines[i][productId + 'icon'] = this.actionToIcon[qLLs[j].MLCPQ_Action_Type__c];
                            }
                        }
                    }
                }
            }

            this.sortColumns(cols);
            this.qllData = accountLines;

            const eventData = {
                careType: this.careType,
                selectedPage: this.pageNumber,
                selectedSortField: this.sortField,
                selectedSortDirection: this.isAscending
            }
            const changeEvent = new CustomEvent('filterchange', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: eventData
            });
            this.dispatchEvent(changeEvent);

            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
            this.log(e);
            this.showError(e.body.message);
        }
    }

    async onProductSelect(event) {
        try {
            this.isLoading = true;
            const addProductResult = await onAddProduct({
                quoteId: this.quoteId,
                productId: event.detail.value,
                quoteModel: this.quoteModel
            });
            this.log({addProductResult});
            const quoteLines = addProductResult.relatedQuoteLines;
            if (addProductResult.quoteModel && Object.keys(addProductResult.quoteModel).length > 0) {
                this.quoteModel = addProductResult.quoteModel;
            }
            this.processTempColumn(quoteLines);

            await this.loadData();

            this.isLoading = false;
            this.showSuccess('Changes have been saved successfully');

            this.products = this.products.filter((product) => {
                return product.value != event.detail.value;
            });
        } catch (e) {
            this.isLoading = false;
            console.log(e);
            this.showError(e.body.message);
        }
    }

    processTempColumn(quoteLines) {
        const productId = this.processId(quoteLines[0].SBQQ__Product__c);
        const column = {
            SBQQ__Product__c: quoteLines[0].SBQQ__Product__c,
            SBQQ__Product__r: quoteLines[0].SBQQ__Product__r,
            quoteLines
        };

        for (let i in this.productsForAdd) {
            if (this.processId(this.productsForAdd[i].Id) === productId) {
                column.maintenanceMode = this.productsForAdd[i].MLCPQ_Maintenance_Mode_Flag__c;
            }
        }

        this.tempColumns.push(column);
        this.product2Column[productId] = column;
        console.log(this.tempColumns);

        this.product2QL[productId] = quoteLines;
        const options = [{
            label: 'None',
            value: ''
        }];
        for(let i in quoteLines) {
            options.push({
                label: quoteLines[i].Disc_Unit_Price__c,
                value: quoteLines[i].Id
            });
        }
        const isFragmented = this.product2QL[productId].length > 1;
        this.columns.push({
            label: quoteLines[0].SBQQ__Product__r.Name,
            fieldName: productId,
            editable: true,
            type: isFragmented ? 'combobox' : 'boolean',
            initialWidth: this.calculateWidth(quoteLines[0].SBQQ__Product__r.Name),
            cellAttributes: {
                alignment: 'center',
                class: {
                    fieldName: `${productId}class`
                },
            },
            typeAttributes: {
                options
            },
        });
        this.sortColumns([...this.columns]);
    }

    sortColumns(columns) {
        const staticCols = columns.splice(0, 2);
        this.columns = [...staticCols, ...columns.sort((col1, col2) => {
            if (col1.label < col2.label) {
                return -1;
            }
            if (col1.label > col2.label) {
                return 1;
            }

            return 0;
        })];
        this.log({product2QL: this.product2QL});
        this.log({columns: JSON.parse(JSON.stringify(this.columns))});
    }


    async onSelectChange(event) {
        const values = event.detail.draftValues;
        const payload = [];
        let accObj = {};
        let isCreate = false;

        for (let i in values) {
            const productId = this.getProductId(values[i]);
            const accLine = this.qllData[parseInt(values[i].index)];
            isCreate = values[i][productId];
            const quantityMethod = this.product2QL[productId][0].MLCPQ_Quantity_Method__c;
            this.log(this.product2QL[productId]);
            if (isCreate && !accLine[productId]) {
                if (accLine.qLLMap[productId]) {
                    payload.push(accLine.qLLMap[productId]);
                } else {
                    accObj = {
                        'Account__c': accLine.Account__c,
                        'Id': accLine.Id
                    };
                    payload.push({
                        'MLCPQ_Account_Line__c': accLine.Id,
                        'MLCPQ_Quote_Line__c': this.product2QL[productId][0].Id,
                        'MLCPQ_Quantity__c': quantityMethod !== 'Per Facility' ? accLine.Quantity__c : 1,
                        'MLCPQ_Quote__c': this.quoteId,
                        'MLCPQ_Sold_To_Account__c': this.accountId,
                        'MLCPQ_Bill_To_Account__c': this.accountId,
                        'MLCPQ_PO_Number__c': this.product2QL[productId][0].SBQQ__Quote__r.PO_Number__c,
                        'MLCPQ_Amendment_Reason__c': this.product2QL[productId][0].SBQQ__Quote__r.Amendment_Reason__c,
                        'MLCPQ_Amendment_Type__c': this.product2QL[productId][0].SBQQ__Quote__r.Amendment_Type__c,
                        'CurrencyIsoCode': this.product2QL[productId][0].CurrencyIsoCode,
                        'MLCPQ_Account_Line__r.Account__c': accLine.Account__c,
                        'MLCPQ_Account_Line__r': accObj
                    });
                }
            } else if (!isCreate && accLine[productId]) {
                payload.push(accLine.qLLMap[productId]);
            }
        }
        this.log({payload: JSON.parse(JSON.stringify(payload))});

        try {
            if (payload.length > 0) {
                this.isLoading = true;
                if (isCreate) {
                    await createQuoteLineLocation({quoteLineLocations: payload});
                    await this.loadData();
                    this.isLoading = false;
                    this.showSuccess('Changes have been saved successfully');
                } else {
                    await deleteQuoteLineLocation({quoteLineLocations: payload});
                    await this.loadData();
                    this.isLoading = false;
                    this.showSuccess('Changes have been saved successfully');
                }
            } else {
                this.undoChanges();
            }
        } catch (e) {
            this.log(e);
            this.undoChanges();
            this.showError(e.body.message);
            this.isLoading = false;
        }
    }

    showSuccess(message) {
        const event = new ShowToastEvent({
            title: message,
            variant: 'success',
            mode: 'pester'
        });
        this.dispatchEvent(event);
    }


    showError(message) {
        this.dispatchEvent(new ShowToastEvent({
            title: message,
            role: 'status',
            variant: 'error',
            mode: 'pester'
        }));
    }

    getProductId(rowChange) {
        const keys = Object.keys(rowChange);
        for (let i in keys) {
            if (keys[i] !== 'index') {
                return keys[i];
            }
        }
    }

    undoChanges() {
        this.columns = [...this.columns];
    }

    processId(id) {
        return id.substr(0, 15);
    }

    async onFragmentedPriceChange(data) {
        const payload = [];
        let accObj = {};
            const selectedItems = this.template.querySelector(`[data-table='select-table']`).getSelectedRows();

        const productId = data.detail.product;
        let accLines = [this.qllData[parseInt(data.detail.row)]];
        for (let i in selectedItems) {
            if (accLines[0].Id === selectedItems[i].Id) {
                accLines = selectedItems;
                break;
            }
        }

        for (let i in accLines) {
            const accLine = accLines[i];
            const qll = accLine.qLLMap[productId];
            const quantityMethod = this.product2QL[productId][0].MLCPQ_Quantity_Method__c;
            if (this.isEnabled(accLine, productId)) {
                if (!qll) {
                    if (accLine.qLLMap[productId]) {
                        payload.push(accLine.qLLMap[productId]);
                    } else {
                        accObj = {
                            'Account__c': accLine.Account__c,
                            'Id': accLine.Id
                        };
                        payload.push({
                            'MLCPQ_Account_Line__c': accLine.Id,
                            'MLCPQ_Quote_Line__c': data.detail.newValue,
                            'MLCPQ_Quantity__c': quantityMethod !== 'Per Facility' ? accLine.Quantity__c : 1,
                            'MLCPQ_Quote__c': this.quoteId,
                            'MLCPQ_Sold_To_Account__c': this.accountId,
                            'MLCPQ_Bill_To_Account__c': this.accountId,
                            'MLCPQ_PO_Number__c': this.product2QL[productId][0].SBQQ__Quote__r.PO_Number__c,
                            'MLCPQ_Amendment_Reason__c': this.product2QL[productId][0].SBQQ__Quote__r.Amendment_Reason__c,
                            'MLCPQ_Amendment_Type__c': this.product2QL[productId][0].SBQQ__Quote__r.Amendment_Type__c,
                            'CurrencyIsoCode': this.product2QL[productId][0].CurrencyIsoCode,
                            'MLCPQ_Account_Line__r': accObj           
                        });
                    }
                } else if (qll) {
                    if (data.detail.newValue) {
                        qll.MLCPQ_Quote_Line__c = data.detail.newValue;
                    }
                    payload.push(qll);
                }
            }
        }

        console.log(payload.length);

        try {
            if (payload.length > 0) {
                this.isLoading = true;
                if (data.detail.oldVaule && !data.detail.newValue) {
                    console.log({productId, quoteLineLocations: payload, action: 'Uncheck'});
                    const priceQLLs = await priceFragmentationChanged({productId, quoteLineLocations: payload, action: 'Uncheck'});
                    console.log(priceQLLs);
                    this.isLoading = false;
                    this.showSuccess('Changes have been saved successfully');
                } else {
                    console.log({productId, quoteLineLocations: payload, action: 'UpdatePrice'});
                    const priceQLLs = await priceFragmentationChanged({productId, quoteLineLocations: payload, action: 'UpdatePrice'});
                    console.log(priceQLLs);
                    this.isLoading = false;
                    this.showSuccess('Changes have been saved successfully');
                }
                await this.loadData();
            } else {
                this.undoChanges();
            }
        } catch (e) {
            this.log(e);
            this.undoChanges();
            this.showError(e.body.message);
            this.isLoading = false;
        }

    }

    isEnabled(accLine, productId) {
        return !accLine[productId + 'class'].includes('disabled');
    }

    updateColumnSorting(event){
        let fieldName = event.detail.fieldName;
        if (fieldName === this.sortField) {
            this.isAscending = !this.isAscending;
        } else {
            this.isAscending = true;
        }
        this.sortField = fieldName;
        this.sortDirection = this.isAscending ? 'asc' : 'desc';
        
        this.loadData();
    }

    calculateWidth(label) {
        const ruler = this.template.querySelector(`span[data-selector='textRuler']`);
        ruler.innerText = label;
        return ruler.offsetWidth + 50;
    }

    onPageChange(event) {
        this.pageNumber = event.detail.pageNumber;
        this.rowOffset = event.detail.rowOffset;
        this.pageSize = event.detail.pageSize;
        this.template.querySelector(`[data-table='select-table']`).selectedRows =[];
        this.loadData();
    }
    
    log(data) {
        console.log(data);
    }

}