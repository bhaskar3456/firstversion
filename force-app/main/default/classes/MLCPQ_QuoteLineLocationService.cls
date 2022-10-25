public class MLCPQ_QuoteLineLocationService {

    public class QuoteLineLocationServiceException extends Exception {}

    public static MLCPQ_QuoteLineLocationService instance() {
        return new MLCPQ_QuoteLineLocationService();
    }

}