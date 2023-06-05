({
    
	handleSelectPreferences: function (component, event, helper) {
        console.log('-- helper.handleSelectPreferences -- Start -- ');
        $( document ).ready(function() {
            var likedItems= component.get("v.likedItems");
            var dislikedItems= component.get("v.dislikedItems");
            var imageNames = [];
            var imageElementList = $('.imageName');
            var numOfImages = imageElementList.length;
            for(var i = 0; i < numOfImages; i++){
                imageNames.push($(imageElementList.get(i)).text());
            }


            console.log('imageElementList: ' + imageElementList.toString() );
            console.log('debug - imageNames: ' + imageNames + ' Num Of Images: ' + numOfImages);

            var itemIdx = -1;
            var itemName = '';
            var itemCount = 0;
            
            $("#tinderslide").jTinder({
                 onDislike: function (item) {
                    itemIdx = item.index();
                    itemName = imageNames[itemIdx];
                    dislikedItems.push(itemName);
                    itemCount++;
                    if(itemCount === numOfImages){
                      	helper.handleSelectPreferencesCompleted(component, likedItems, dislikedItems);
                    }
                },
                onLike: function (item) {
                    itemIdx = item.index();
                    itemName = imageNames[itemIdx];
                    likedItems.push(itemName);
                    itemCount++;
                    if(itemCount === numOfImages){
                        helper.handleSelectPreferencesCompleted(component, likedItems, dislikedItems);
                     }
                },
                animationRevertSpeed: 200,
                animationSpeed: 400,
                threshold: 1,
                likeSelector: '.like',
                dislikeSelector: '.dislike'
            });
        });
    },
    

    handleSelectPreferencesCompleted: function (component, likedItems, dislikedItems) {
        console.log('-- helper.handleSelectPreferencesCompleted -- Start -- ');
        console.log('Liked Items : ' + likedItems);
        console.log('Disliked Items : ' + dislikedItems);
        var message = component.get("v.completedMessage");
        $('#tinderslide').hide();
        component.set("v.multipicklistSwipeyResult", likedItems.join(';'));
        
        $('#tinderslide_output').removeClass("hide");
        $('#tinderslide_output').html(
            '<div id="tinderslide_output_message">'+ message +'</div>'
        );
        console.log('-- helper.handleSelectPreferencesCompleted -- End -- ');
    }, 

    getSitePrefixName: function (component, event, helper){
        console.log('-- helper.getSitePrefixName -- call server Start -- ');
        helper.callServer(
            component,
            "c.getSitePrefixName",
            function(response){
                if(response && response.length > 0){
                   component.set('v.sitePrefix', '/' + response);
                }else {
                   component.set('v.sitePrefix', '');
                }
                helper.getStaticResourceZipImagefileNames(component, event, helper);
                console.log('-- helper.getSitePrefixName -- End -- ');
            },
            {
                
            }
        );
    },

    getStaticResourceZipImagefileNames: function (component, event, helper) {
        console.log('-- helper.getImageNamesInStaticResourceZip -- call server Start -- ');
        helper.callServer(
            component,
            "c.getStaticResourceZipImagefileNames",
            function(response){
                if(response.length == 1 && response[0].startsWith("Error")){
                    helper.showToast('Error','The static resource zipfile cannot be found, please check your input resource name', 'error');
                }
                
                else{
                    console.log(">>>> helper.getStaticResourceZipImagefileNames response " + response);
                    var images = [];
                    for(var i = 0; i < response.length; i++){
                        console.log('>> response: ' + response[i]);
                        var x = {};
                        x.url = response[i];
                        x.title = response[i].substring(0, response[i].lastIndexOf('.'));
                        images.push(x);
                    }
                    
                    //console.log('before sorting:' + JSON.stringify(images));
                    //EDIT - 2019.1.23
                    //Sorting images by name
                    images = images.sort(function (a, b) {
                        var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
                        if (titleA < titleB) //sort string desc
                            return 1;
                        if (titleA > titleB)
                            return -1;
                        return 0; //default return value (no sorting)
                    });

                   //console.log('after sorting:' + JSON.stringify(images));

                    component.set("v.staticResourceZipImagefiles", images);
                    this.handleSelectPreferences(component, event, helper);
                }
                console.log('-- helper.getStaticResourceZipImagefileNames -- End -- ');
            },
            {
                zipName: component.get("v.staticResourceZipName")
            }
        );
    },

    showToast : function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": 'dismissible'
        });
        toastEvent.fire();
        //$A.get('e.force:refreshView').fire();
    
    },

    callServer: function(component, method, callback, params) {
        var action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // pass returned value to callback function
                callback.call(this, response.getReturnValue());
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    }

  
})