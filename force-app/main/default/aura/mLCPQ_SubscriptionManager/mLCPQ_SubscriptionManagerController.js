({
	onPageReferenceChange: function(cmp, evt, helper) {
                cmp.set("v.quoteId", null);
                const myPageRef = cmp.get("v.pageReference");
                const quoteId = myPageRef.state.c__quoteId;
                cmp.set("v.quoteId", quoteId);

                const container = cmp.find("container");
                $A.createComponent(
                    "c:mLCPQ_QuoteEdit",
                    { quoteId },
                    (subscriptionEdit) => {
                            container.set("v.body", [subscriptionEdit]);
                    }
                );
        }
})