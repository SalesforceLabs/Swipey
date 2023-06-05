<!--
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 -->
 
@isTest
private class SwipeyFlowControllerTest {
    
   
    @isTest 
    static void getSitePrefixNameTest() 
    {
        String prefix = SwipeyFlowController.getSitePrefixName();
    }

    @isTest
    static void getSwipeyImagesTest() 
    {
       List<SwipeyImage__c> sList = new List<SwipeyImage__c>();
       String category = '';
       sList = SwipeyFlowController.getSwipeyImages(category);
    }

   public static boolean checkFLS(Schema.DescribeSObjectResult objectType, List<string> fields, string checkType) {
        return checkFieldLevelSecurity(objectType.fields.getMap(), fields, checkType);
    }
    
    public static boolean checkObjectSecurity(DescribeSObjectResult objectType, string checkType) {
        boolean ret = false;
        if (checkType == 'Create') {
            ret = objectType.isCreateable();
        } else if (checkType == 'Delete') {
            ret = objectType.isDeletable();
        } else if (checkType == 'Update') {
            ret = objectType.isUpdateable();
        }
        return ret;
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