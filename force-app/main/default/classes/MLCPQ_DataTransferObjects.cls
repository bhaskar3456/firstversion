/*********************************************************************************************************************************************
Name : Data Transfer Object class
Created BY : George Kibilov
Company Name : aMind Solutions
Project      : Multi-Location Quoting
Created Date : 2nd July 2020
Modified Date : 2nd July 2020
Modified By  : George Kibilov
Class   :  MLCPQ_DataTransferObjects
Test Class: -
Test Class URL: -
Description : This class contains DTO classes for comunication with UI
              The class should not contain any business logic or behavior
***********************************************************************************************************************************************/


global class MLCPQ_DataTransferObjects  {

    global class ProServQuoteLine {
        @AuraEnabled
        public ID quoteLineId { get; set; }
 
        @AuraEnabled
        public ID productId { get; set; }

        @AuraEnabled
        public ID initialPsId { get; set; }

        @AuraEnabled
        public ID subsequentPsId { get; set; }

        @AuraEnabled
        public ID aiePsId { get; set; }

        @AuraEnabled
        public String productName { get; set; }

        @AuraEnabled
        public Decimal requiredQty { get; set; }

        @AuraEnabled
        public Decimal noneQty { get; set; }

        global ProServQuoteLine() {}

        global ProServQuoteLine(AggregateResult ar) {
            this.quoteLineId = ar.get('quoteLineId') == null ? null : (Id)ar.get('quoteLineId'); 
            this.productId = ar.get('productId') == null ? null : (Id)ar.get('productId'); 
            this.initialPsId = ar.get('initialPsId') == null ? null : (Id)ar.get('initialPsId'); 
            this.subsequentPsId = ar.get('subsequentPsId') == null ? null : (Id)ar.get('subsequentPsId'); 
            this.aiePsId = ar.get('aiePsId') == null ? null : (Id)ar.get('aiePsId'); 
            this.productName = ar.get('productName') == null ? null : (String)ar.get('productName'); 
            this.requiredQty = ar.get('requiredQty') == null ? null : (Decimal)ar.get('requiredQty'); 
            this.noneQty = ar.get('noneQtySum') == null ? null : (Decimal)ar.get('noneQtySum'); 
        }
    }

    global class AddProductResponse {
            @AuraEnabled
            public List<SBQQ__QuoteLine__c> relatedQuoteLines { get; set; }
     
            @AuraEnabled
            public String quoteModel { get; set; }

            global AddProductResponse (List<SBQQ__QuoteLine__c> relatedQuoteLines, String quoteModel) {
                this.relatedQuoteLines = relatedQuoteLines;
                this.quoteModel = quoteModel;
            }
    }

    global class getUniqueProductsFromQuoteLineLocationsByCareTypeResponse {

        @AuraEnabled
        public ID productId   { get; set; } 

        @AuraEnabled
        public String productName   { get; set; } 

        @AuraEnabled
        public String careType   { get; set; } 

        @AuraEnabled
        public ID quoteId   { get; set; } 

        @AuraEnabled
        public Integer numLocations   { get; set; } 

        @AuraEnabled
        public Boolean maintenanceMode   { get; set; } 
        
        @AuraEnabled
        public List<SBQQ__QuoteLine__c> relatedQuoteLines { get; set; }

        global getUniqueProductsFromQuoteLineLocationsByCareTypeResponse(AggregateResult ar) {
            this.productId = ar.get('productId') == null ? null : (Id)ar.get('productId'); 
            this.productName = ar.get('productName') == null ? null : (String)ar.get('productName'); 
            this.careType = ar.get('careType') == null ? null : (String)ar.get('careType'); 
            this.quoteId = ar.get('quoteId') == null ? null : (Id)ar.get('quoteId'); 
            this.numLocations = ar.get('numLocations') == null ? null : (Integer)ar.get('numLocations');                   
        }
    }

    global class getAccountLinesWithQLLocationsResponse{
        @AuraEnabled
        public Integer totalNumberOfRecords   { get; set; } 
        @AuraEnabled
        public List<Account_Line__c> accountLines { get; set; }
    }
    global class onStartConfigurationResponse{
        @AuraEnabled
        public Boolean success  { get; set; } 
        @AuraEnabled
        public String error  { get; set; }             
    }

    global class RunningJobResponse {
        
        @AuraEnabled
        public String batchClassName { get; set; }
 
        @AuraEnabled
        public String status { get; set; }

        @AuraEnabled
        public String extendedStatus { get; set; }

        public RunningJobResponse(String batchClassName, String status, String extendedStatus){
            this.batchClassName = batchClassName;
            this.status = status;
            this.extendedStatus = extendedStatus;
        }
    }         
}