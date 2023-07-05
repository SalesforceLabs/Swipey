/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
 
global class SwipeyFlowController {
    
    @AuraEnabled
    public static String getSitePrefixName() {
        String networkId = Network.getNetworkId();
        List<Network> n = [SELECT Id, UrlPathPrefix FROM Network WHERE Id = :networkId LIMIT 1];
        if(n.size() > 0){ 
            return n[0].UrlPathPrefix;
        } 
        return null;
    }  

    @AuraEnabled
    public static List<SwipeyImage__c> getSwipeyImages(String category) { 
        String searchCategory = category;

        String q = 'SELECT Id, Active__c,Image_Category__c, Image_Description__c,Image_Url__c,Order__c,Saved_value__c,Name FROM SwipeyImage__c WHERE Active__c = true' ;

        if(!(String.isBlank(searchCategory) || searchCategory == 'None')){
            q += ' AND Image_Category__c = ' + '\'' + searchCategory + '\'';
        }
        
        q += ' Order By Order__c DESC';

        System.debug('>>> q: ' + q);

        List<SwipeyImage__c> swipeyImagesList = Database.query(q);
        if(swipeyImagesList.size() > 0){ 
            return swipeyImagesList;
        }
        return null;
    } 
}