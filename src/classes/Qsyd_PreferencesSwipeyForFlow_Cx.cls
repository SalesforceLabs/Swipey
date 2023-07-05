/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
 
/*
   	Author:         Elly Yijun Zhu
    Company:        Salesforce
    Description:    Preferences Capture 
    Component:      Qsyd_PreferencesSwipeyForFlowCmp
    Apex:           Qsyd_PreferencesSwipeyForFlow_Cx
	Test Cls:		QsydSwipeyForFlowTest
    Objects:        
	History:

	When            Who                 What
	30-Aug-2018     Elly Yijun Zhu
	
*/
global  without sharing  class Qsyd_PreferencesSwipeyForFlow_Cx { 

    @AuraEnabled
    public static List<String> staticResourceZipImagefileNames {get;set;} 

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
    public static List<String> getStaticResourceZipImagefileNames(String zipName){
        staticResourceZipImagefileNames = new List<String>();
        List<StaticResource> sr = new List<StaticResource>();
        List<String> fields = new List<string> { 'Id', 'Body' };
        Boolean isAccessible = checkFLS(StaticResource.sObjectType.getDescribe(), fields, 'Read');
        if(isAccessible){
            sr = [SELECT Id,Body FROM StaticResource WHERE Name = :zipName LIMIT 1];
        }
        if(sr.size() == 0){
            staticResourceZipImagefileNames.add('Error: The requested static resource file cannot be found or you have insufficient access, please check the static resource name field value in the Preferences Survey Card Set record');
        }else{
            // Extract the file names
           staticResourceZipImagefileNames = extractFileNamesFromZip(sr[0].Body);
        }
        return staticResourceZipImagefileNames;
    }
    
    public static List<String> extractFileNamesFromZip(Blob zipBlob) {
        List<String> fileNamesList = new List<String>();
	    Zippex zip = new Zippex(zipBlob);
        Set <String> fileNames = zip.getFileNames();
        for (String fileName : fileNames)
        {
            if(fileName.contains('/')){
                continue;
            }else{
                fileNamesList.add(fileName);
                system.debug('>>Image Name: ' + fileName);
            }
        }
        return fileNamesList;
    }

    public static boolean checkFLS(Schema.DescribeSObjectResult objectType, List<string> fields, string checkType) {
        return checkFieldLevelSecurity(objectType.fields.getMap(), fields, checkType);
    }

     private static boolean checkFieldLevelSecurity(Map<String,Schema.SObjectField> fieldMap, List<string> fields, string checkType) {
        boolean ret = false;
        for (String fieldToCheck : fields) {
            if (checkType == 'Update') {
                ret = fieldMap.get(fieldToCheck).getDescribe().isUpdateable();
            } else if (checkType == 'Read') {
                ret = fieldMap.get(fieldToCheck).getDescribe().isAccessible();
            }
        }
        return ret;
    }
}