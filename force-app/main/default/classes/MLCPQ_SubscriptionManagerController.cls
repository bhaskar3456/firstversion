public class MLCPQ_SubscriptionManagerController {

    /**
     * On check inserts Quote Line Locations
     * @param quoteLineLocations 
     * @exception Exception
     */    
    @AuraEnabled
    public static void createQuoteLineLocation (List<MLCPQ_QuoteLineLocation__c> quoteLineLocations) {  
        /*MLCPQ_QuoteLineLocationService svc = MLCPQ_QuoteLineLocationService.instance();
        try {
            svc.createQuoteLineLocations(quoteLineLocations);
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.createQuoteLineLocation: '+e.getStackTraceString());
            throw e;
        }*/
    }

    /**
     * On uncheck removes Quote Line Locations
     * @param quoteLineLocations 
     * @exception Exception
     */    
    @AuraEnabled
    public static void deleteQuoteLineLocation (List<MLCPQ_QuoteLineLocation__c> quoteLineLocations) {    
        /*MLCPQ_QuoteLineLocationService svc = MLCPQ_QuoteLineLocationService.instance();
        try {
            svc.deleteQuoteLineLocations(quoteLineLocations);
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.deleteQuoteLineLocation: '+e.getStackTraceString());
            throw e;
        }*/
    }  

    @AuraEnabled
    public static MLCPQ_DataTransferObjects.getAccountLinesWithQLLocationsResponse getAccountLinesWithQLLocations (Id accountId, Id quoteId, String careType, Integer pageNumber, Integer pageSize, String sortField, Boolean isAscending) {    
        /*MLCPQ_QuoteLineLocationService svc = MLCPQ_QuoteLineLocationService.instance();  
        try {
            return svc.loadAccountLinesWithQLLocations(accountId, quoteId, careType, pageNumber, pageSize, sortField, isAscending);
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.getAccountLinesWithQLLocations: '+ e.getStackTraceString());
            throw e;
        }*/
        return null;
    }

    /**
     * Returns all MLCPQ products which are not Professional Services and and are in  same pricebook as quote with same currencyIsoCode
     * @param quoteId 
     * @returns `List<Product2>`
     * @exception Exception
     */    
    @AuraEnabled
    public static List<Product2> getProductsForAdd (Id quoteId) {    
        /*try {         
            MLCPQ_ProductService svc = MLCPQ_ProductService.instance();
            List<Product2> products =  svc.getMLCPQProducts(quoteId);
            return products;
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.getProductsForAdd: '+e.getStackTraceString());
            throw e;
        } */
        return null;      
    } 

    /**
     * On add product Creates new Quote Line if not found, else returns found ones
     * Receives and Returns JSON String representing current quote model
     * @param quoteId 
     * @param productId 
     * @param quoteModel 
     * @returns `MLCPQ_DataTransferObjects.AddProductResponse`
     * @exception Exception
     */   
    @AuraEnabled
    public static MLCPQ_DataTransferObjects.AddProductResponse onAddProduct (Id quoteId, Id productId, String quoteModel) {  
        /*if(quoteId == null || productId == null) throw new IllegalArgumentException('Invalid Parameters');
        try {
            //query quote items that reference productId
            //if found return a listof founf QLs
            //else add a product via quoting service addProduct(quoteId, productId, priceBookId, currencyCode) 
            //and return a list of one QL
            MLCPQ_QuoteLineLocationService svc = MLCPQ_QuoteLineLocationService.instance();     
            return svc.addProduct(quoteId, productId, null, quoteModel);
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.onAddProduct: '+e.getStackTraceString());
            throw e;
        }*/
        return null;
    }

    /**
     * Get Unique Products and Unit Prices for a given Quote and Care Type from Quote Line Location junction table
     * 
     * @param quoteId 
     * @param careType 
     * @returns `List<MLCPQ_DataTransferObjects.getUniqueProductsFromQuoteLineLocationsByCareTypeResponse`
     * @exception Exception
     */   
    @AuraEnabled
    public static List<MLCPQ_DataTransferObjects.getUniqueProductsFromQuoteLineLocationsByCareTypeResponse> getUniqueProductsFromQuoteLineLocationsByCareType (Id quoteId, String careType) {    
        /*MLCPQ_QuoteLineLocationService svc = MLCPQ_QuoteLineLocationService.instance();
        try {
            return svc.findDistinctProductsForCareType(quoteId, careType);
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.getUniqueProductsFromQuoteLineLocationsByCareType: '+e.getStackTraceString());
            throw e;//new AuraHandledException(e.getMessage());
        }*/
        return null;
    }   

    /**
     * Accepts 'Uncheck' or 'UpdatePrice' action to support price fragmentation selections from UI <br>
     * and performs quote line location manipulations depending on their Action Type
     * @param productId 
     * @param quoteLineLocations 
     * @param action 
     * @returns `List<MLCPQ_QuoteLineLocation__c>`
     * @exception Exception
     */   
    @AuraEnabled
    public static List<MLCPQ_QuoteLineLocation__c> priceFragmentationChanged (Id productId, List<MLCPQ_QuoteLineLocation__c> quoteLineLocations, String action) {
        /*MLCPQ_QuoteLineLocationService svc = MLCPQ_QuoteLineLocationService.instance();
        try {
            return svc.priceFragmentationChanged(productId, quoteLineLocations, action);
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug('MLCPQ_SubscriptionManagerController.priceFragmentationChanged: '+e.getStackTraceString());
            throw e;
        }   */
        return null;     
    }

}