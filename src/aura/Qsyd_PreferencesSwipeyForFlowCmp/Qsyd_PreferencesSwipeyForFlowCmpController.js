({
	handleInit : function(component, event, helper) {
        console.log('-- start: controller.handleInit -- ');
        var staticResourceName = component.get("v.staticResourceZipName");
        component.set("v.staticResourceZipName", staticResourceName.trim());
        
        helper.getSitePrefixName(component, event, helper);
	}
})