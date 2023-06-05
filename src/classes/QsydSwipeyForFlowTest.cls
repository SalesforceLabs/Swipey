<!--
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 -->
 
@isTest
private class QsydSwipeyForFlowTest 
{
   
    @isTest 
    static void testZipFileNotExist() 
    {
        List<String> fileNames = Qsyd_PreferencesSwipeyForFlow_Cx.getStaticResourceZipImagefileNames('q');
    }

    @isTest
    static void testZipFileExist() 
    {
        Blob tinyZip = EncodingUtil.convertFromHex('504B030414000800080096BC7A4700000000000000000000000008001000746578742E74787455580C0055EC5756ECEB5756262ABF22F3C8E40200504B07089A3C22D50500000003000000504B0102150314000800080096BC7A479A3C22D5050000000300000008000C000000000000000040A48100000000746578742E7478745558080055EC5756ECEB5756504B05060000000001000100420000004B0000000000');
        List<String> fileNames = Qsyd_PreferencesSwipeyForFlow_Cx.extractFileNamesFromZip(tinyZip);
        System.assertEquals(fileNames, new List<String>{'text.txt'}, 'Expected text.txt');
    }
}