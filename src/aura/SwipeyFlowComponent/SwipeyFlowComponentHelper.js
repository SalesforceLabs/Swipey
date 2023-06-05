({
    
	handleSelectPreferences: function (component, event, helper) {
        console.log('-- helper.handleSelectPreferences -- Start -- ');
        $( document ).ready(function() {
            var likedItems= component.get("v.likedItems");
            var dislikedItems= component.get("v.dislikedItems");
            var imageValues = [];
            var imageElementList = component.get('v.staticResourceZipImagefiles');
            var numOfImages = imageElementList.length;
            for(var i = 0; i < numOfImages; i++){
                imageValues.push(imageElementList[i].value);
            }

           // console.log('imageElementList: ' + imageElementList.toString() );
           // console.log('debug - imageValues: ' + imageValues + ' Num Of Images: ' + numOfImages);

            var itemIdx = -1;
            var itemName = '';
            var itemCount = 0;
            
            $("#tinderslide").jTinder({
                 onDislike: function (item) {
                    itemIdx = item.index();
                    itemName = imageValues[itemIdx];
                    dislikedItems.push(itemName);
                    itemCount++;
                    if(itemCount === numOfImages){
                      	helper.handleSelectPreferencesCompleted(component, likedItems, dislikedItems);
                    }
                },
                onLike: function (item) {
                    itemIdx = item.index();
                    itemName = imageValues[itemIdx];
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
      //  console.log('-- helper.handleSelectPreferencesCompleted -- Start -- ');
     //   console.log('Liked Items : ' + likedItems);
      //  console.log('Disliked Items : ' + dislikedItems);
        var message = component.get("v.completedMessage");
        $('#tinderslide').hide();
        component.set("v.multipicklistSwipeyResult", likedItems.join(';'));
        
        $('#tinderslide_output').removeClass("hide");
        $('#tinderslide_output').html(
            '<div id="tinderslide_output_message">'+ message +'</div>'
        );
       // console.log('-- helper.handleSelectPreferencesCompleted -- End -- ');
    }, 

    getSitePrefixName: function (component, event, helper){
      //  console.log('-- helper.getSitePrefixName -- call server Start -- ');
        helper.callServer(
            component,
            "c.getSitePrefixName",
            function(response){
                if(response && response.length > 0){
                   component.set('v.sitePrefix', '/' + response);
                }else {
                   component.set('v.sitePrefix', '');
                }
                helper.getSwipeyImages(component, event, helper);
                //console.log('-- helper.getSitePrefixName -- End -- ');
            },
            {
                
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

    getSwipeyImages: function (component, event, helper){
        helper.callServer(
            component,
            "c.getSwipeyImages",
            function(response){
                if(response == null){
                    component.set('v.showSpinner', false);
                    document.getElementById('errormessage').classList.remove('slds-hide');
                    return;
                }
                const sitePrefix = component.get('v.sitePrefix') || '';
                let imagesList = []; 
                let imageUrl;
                for(var i = 0; i < response.length; i++){
                    imageUrl = response[i].Image_Url__c;
                    if(!imageUrl){
                        imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAADAFBMVEVMaXH///+AgIC0tLSZmZmurq6fn5+pqamtra2srKylpaWqqqqpqamtra2np6esrKyrq6unp6erq6urq6urq6upqamqqqqqqqqqqqqsrKypqamqqqqqqqqpqamqqqqqqqqrq6upqamrq6uqqqqrq6uqqqqqqqqrq6upqamrq6uqqqqqqqqqqqqqqqqqqqqqqqqrq6upqamqqqqqqqqrq6upqamrq6upqamqqqqpqamrq6uqqqqpqamqqqqqqqqqqqqqqqqrq6upqamrq6urq6uqqqqrq6uqqqqrq6uqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///+qqqpERETu7u4/Pz89PT3l5eVBQUHy8vL+/v5DQ0P9/f3S0tKtra2urq78/PxCQkL4+Pi9vb3Pz8+2trbIyMjx8fH5+fn19fWrq6vh4eHw8PA7Ozvz8/P29vb39/eysrLLy8vv7+9AQEDp6en7+/uzs7OQkJDR0dHU1NTe3t5GRkZJSUnDw8Pn5+fHx8fQ0NDm5ubt7e309PRISEhbW1tcXFyDg4PY2Njo6Oj6+vp6enq8vLzExMTc3Nzg4ODr6+tFRUVOTk5gYGC0tLTCwsLGxsbj4+Pq6urs7Ow+Pj5LS0t2dnZ3d3exsbG1tbW4uLjBwcHX19fd3d2srKywsLBYWFicnJygoKDOzs7k5ORHR0fNzc3a2tpSUlJ7e3uBgYGNjY2hoaGoqKi7u7u/v7/f399MTExRUVFVVVVeXl5mZmaLi4ulpaW6urrAwMDKysrb29tiYmJkZGRoaGhubm58fHx/f3+dnZ2ioqKjo6NQUFBWVlZXV1dqamptbW1ycnKVlZWYmJinp6dUVFRxcXGGhoaTk5OUlJQ6OjqHh4fW1tZ1dXWFhYWbm5ukpKSWlpY5OTlsbGyJiYmWK4oXAAAAbHRSTlMAAQIDBQYICgwPERMWGRobHiAiJScsLzEzNDY6PD5BQ0VHSk1UV1pdX2FjZmptb3F1d3h6fH1/gIOGiIqMjpGUmJyfoKOlpqiqrbCxtLa5vcHFyczP0dPV2Nrc3uDj5ufp7O7x8/X3+Pn7/f6BPWENAAAbkElEQVR42uxdCXwU1f0foCmkYFGx2GqrFJVUUlEq1oK18rdi/VvE0v7Fk3r8QYi87IaEzS5sNtdCTnJBbhJykIQrHOE+wikEQS4BgQBCBVQQC4iW1qO175iZt3Pszs7sbLLHfD8fwrw38+bNfPcdv+u9YQwYMGDAgAEDBoISXXrecvtddw+Ijr5/MMT90dED7r7r9lt6dmEM8Ijo0y966JOjX3h9UqwsJr3+wugnh0b36xPBhDMi+kY9MmrspFgv8dbYUY9E9Q1Dyrr9+L4RY2JiNSBmzIj7bu3GhAt6/HTwyDdifcL40cPu6smEOrr+ZMjot9xRMC01uWJFWl5elQ2iKi8vbUVFcuo0t71y9IM/DuHBv+eAJ16TeetZyWm20sL0XAuQhSU3vbDUlpY8S6boa4/fE5INrOfAUTESmlpsGZlW4CWsmRnFLRLKYp659wdMSCEy6pmJwnfctnBzoRNogLNwc8U24b0mjoyKZEIEXfs9NUHwcqmnStOBT0gvPZUquOWEp+7sygQ/bhj8kutbTd20OR3ogpotKwSD/9hhNzJBjS79n3YdqDamNNqBjrBXpix3Hb6e7h+802NE1POuo3lKM/AD0ks2ulTy4qDuTDCi50MucsJM/zCFYWneOdNFmhgSfMLEjcPH888/o6LNAvwKa1vLDCrePxZcg1evYW/S7merAR2AnM20O04c/kMmWNDrUdqqTlb7uVFRWOJP0tb1215MMCByKE/V1rR80KHIT9vK1T1uaOALql2j+GF9Wsp00OHILeHF+zcGBbgl547neKpKmkCnoKmEl1Wfu4MJXNz4BE+VzQk6DU5K18ibmcBExEMTOJ2mygE6FY6qqeyjvDnke0wA4jZeXE/LAZ2OnDTuacbcxgQaug/jDKALVoOAgDmZM6kO78EEFPq/womgGSBgsJizFL7ycyZw0H34JFawsulqVfAVRcWsEjTpsYDRr3/EyQsnzCDAkLmAfbTnb2UCAV0GTWDnwM0dptl4D8tuVoyIeTgATKm9n2V/u00doi+rR/Ym9gFH3cB0Mn76KtusdoOAxWK2cb3WyQJ9NGs1bs0EAYz0E2xXHMx0Hrr/nm3hKVYQ0LDa2GnxyU6bFfuMYWWrQhDwaJzJ6tZ9mE7BHWx0x3u5IAiQywr0b/yM6QTcw1qO8wK8C3Kw2Fib8wCmwzFoEpkFD4GgQQaZFSc93MHexQh2aE8N6FlQjEzW5/94h5ptejzLDledaOLTAic7cI3qQDtE5J9JnSsCSm32BlbWzPWXDvPE9nqOla4CUBdURAl59v/rIFfZDUS8mrEIBCVKibfshd5MB+Cml8k0WAmCFNXEPv/STYzfcdNY4r5ZBYIWhUSEGOt3tnq/TLgKEEO7Npi3kbbl54iIXsSFs6GD3fJ6I38DGbf8Osr/gMyDs3SKdOw8pM8kc6If4yG6jybtKui5AmAKYevPfpNOI4jcvi3I+yDbE8koP8pPmk+X35Ox3X8Bjx2K1YSt/2H8goeJfBXEMoMQzYStBxk/IGoSdqMGrSwqRfUMbLHxg33rZ8Q7GKQ6jjxKiTVQd6dPH2JDtoGQgo1YmnUO4upOlOc5IMSQRrwY+vp8/oBvmhwk5nbvYU8mHjJGR9xPbMhBZhf1Bg5iab6P0Q23x2ABK6js7d4iEwsQMbo5yHqTaO0AClPTExn45f6qU9RIV6LlVIEQxU6i9+jjH3sgRAd3Dtb38Avez+iAWydiq0xQ+Oi1IRdbICb0ZXzG97GENSMIYj+0o5FEUvoubQ3HNyoGIY0U/JK/85Wrn2P1+UTIDlgE1lasUvfzUc15GZtlQlLCckU6do+94pvd9HehZ2qQx278oo/6tB7nLRyHDMIAJ/HKldt8MLqPwZ0wQGO29UUNVnvGaDfJ/xq3zQYQFmjwzch8MzaOLgjGWBkNsBzE6xO1+vSfxuJoSDi+vEE+Dq95SmM0cigakj2hGL+wJmNNt+ewTlgEwgZFs7BLX8ua/V+GshFLHofwKw/UEDf6OjbMgLDCArweSn20yFDM8lwQVliNX/o3qjd0GoeKnQJhBuwaG6c2bOtRLLsHwJ4DHYvpWKF+RGVE8vgwsGK5tWyNVxc/+Rj2fXXyvh+dgdypqq0PN04IM3lUJJm+2Vt1wwpBB7QyHNNUWph74hGrBIQlbHjU8n5tz0O4YXXS/ledDec0VaaaiFfDdCp0mRBf+763+w/geMhO2IMuMDB9hgoNsQteRZEGwhZz8OoL72If+scihI3NTwozJsC7baT+iC49CcIYOFLkf73h6oc4cq0ahDHicXybNxFbD2IDaZh4KeRhwRunD/ZieH8pjAVSgWD6svIQ3w+7dMJWbnCVHpQXEzyFLqsAYY5NXgV8R2J7QxsIc6zEtgclY3wUumpmWA/vCFa8LlhpCdQz6KIUEPZ4B/HwR4VF0DjaNqiX1uuDVXi9mOdvRQ1E1ywHBizYO/0Lj2SNCunlAaoNNc94NJHGhKFn1YO/NcZTPxyArtgIDEBgleceD2Q9YcyFwiU9j3tY0oSXfzUCAxDViItX3euHP8E++6Dbbs0/sGN3a1/3Xh1DL3RBC2LjV27JGo1OfwAM0HUEf3KrRL+FTmcDAxhTsPDQw92iJnQ2FRhggb/Udqcbsn6DTuYBA66Rbb92Q9az6GQpMMBiC1477SaWexw6OQUYYJGOYya7uZeyNqizkZkRmoRpqyTUItfTE8ESDnKYbcaY7nIOI0doH6eXSFGUI5ISc8wiqJm/trmXtAahUwvVTRiT4yD2CdKTpwi2L9l3Zk9Z2Z4zx5PdMPYPeIMMcpgVhzGVO7WQzVgsKJAMc7IaZAKrir+ZX3+kzHTk9Hcbi/jcxXEiZKl4vQrEyC9lyRqBTm1WR1aCCaL2A9d0ggtZJ46aeCxLlVUNJsNT8dwhxl4ze2o+SpHTFKv3wZykryThjWlny/iqEg/P5h4i3iTCZBWv90/EyBOyZI1Bp1ZpIMv0rjxZ9muJ5NmTyHNez/GKrMOl7Pub5Mg69An+fZyi8IT9teTaJLbKw62UrCStLasQb4EkG5WFbVlOLWQlnpIjy/oZblDn8zLa8nbgJrYuR5GspfBfLEmmxplMdf8QkVW0Fde4plVoBD6OnqJs79SUldUNyV/WoxZEycrSOmY5sFgaIbfZBbEoayHL9KlVhqy/wx95yeUc9iW/Rj/53xXJOgcvW1+Ik5dgcnaWiKy2daTGvwke42OYEzcvne+qV953IQseagXeHeNHMmT9AmvR2shKTJWS9Q468TF1qh2AnXFXmhJZK+CfXXjgzIyDyTnkNEXKEtitUNOqdMmcUwsz2l0t6A3zdSGrxZ1D7LfqorkpOafh89Q7JGShJjDfdUxfDzPWWxTIiq+Df3aghnoF3utYm4is9MswfeE/sJZvaWbjPJg+J7xt5Tk9yMJx3sPc+SoyNJCVijrYR2KytsDcMkF8SQbKsSmR9TVsNx9WwxT6DS4XichaCblcs7UdZn5Caa+C82CB2HHQpAdZi915LcaiE5kayJqCBvIjc0VkoWHkM2E7+hxmfaNEVuEa+DcFGiphakkxyaPdKxX1+em710IGTvFjfjvMWyd5Nj3IysdbY8hMhsg+M8OqhawUE8RsEVnvwrz9wqt3wKyzSmSBM/Dvt07wLWxhnzeKyKrcC3k5Bxqvwf/W8/ZfmFqzwS9k2fFmD9+T7q2J8mepuRMl5xx8ovJSIVlo+hapAwthPzxqVyIrtsBkOt0GLuLpQURWQzl89WJgWWBymXXjj8FM6aYm8qJDtobp8Gb5uKxkbWQt2oUmfSFZSGD6p/DqDEjD1WwlsrILEM0NMFHbwOWxyP0Ipt5HQ9dRKCoc4PjYDsky85ojh+myQmmWuhdMljdpRauP56bkHEcdcaeALDS/i6aLmjWwAa5SIIsMbfvmJcIu2ywiqw22oYIdSOV+G2bXcWShEYwTpktFtMRr1nZolPdA+WW+JRrJKkTt6JJFgawcRFahIlmtUMC6WA6Pp3J5fD9GsieeSWxl8L13s2Shvtkk0QUn69GybPLLgP+gwfJHybmMZqlWcTfcrKUbAgerES89xOdRHTrxQ8LBfMjBdVE3pC0rAZGlx5iF7X8j5D07hVrJmnIVPtRRp+cBfgXsWvVKAzyeSDHmZfJ5VIfO2ojfuXka1qbpAL9FMGaVIrJ0mA1Bo7yH50WUna6VLHAFvV67C1nzpaLDfmygUCYrbQ0mK1V0umirS5fCKs9BIk98BQ+XC+dAvcjKxCtTJGS9gbIdmslyopa0Z6WiUPqxF2RZDyOuLqzk86gOTUG1afsVJHX5h6xcvEJMYoDHPkOLZrLAcqT0HKfpLUhvVqXu0MPr6F77avg8qkMnxHFIQE2rkWhwu+CJTL+QZcVSaVdxZBbK3Qa0k2U9hiRT3xVpdLAZHVXQPKpD15s5LLoExYjLxEZ3Dda61y9kAbxSU7ys9RaVDlapSaYC9wyazkOJb0QmmjmeTDT08GpcXF0bzeN16Lhp1DDXjjRScvs0ZKKZ6heysKO1j3hjbrUCvNTYhw2jLukvhMY/k6Lxjx46YdOx0zwXHZoWxNp0Hj7MRtNL3HH+pN2mG1l4dxrxToB3YdOfT2QVL4EPJjUr78jLiPferBwvd5rXoc+6zupf0XG9eTZisvz6LFv86tJTW8+uRRT5blbmzH/9xd/uVf3VBamDYi9LFv8DzxM6LK7lAI1kUR2awtKKKmPfPbO9nK2K9VgkXW3x3WEBsQLxcrfcyoo038gqrWXJ4tEqcoVpJovq0BQZ9bDvxbIJZ965WlpXQt3+Jh1cYRBpcoblgeqDQqRO1eNxcRIn6/Eze5aU7TntrZOVOlSFeVuWwTufF1b+BTxXxyebSg6cqz+yK+nw9n99/Y4+TlaIU4iXe+X2YXtH1X2k7nqn2Wf3Pe2pwrwa+H+mWLyGeTWiB8pp0tF9zy1LiRZ/0sOIU5ZFitznQAaH7U49Xvh3HhDH3hqLfd0btIYYZKkgy+iGKrqhMcCrGOB1ER1CH0R00EUoDX0QoVQXdSf0QdQdXRTp0AdRpHUx0YQ+OBON1Pi3ABgQ4SA2/uliVg59cGZlqcNiGjAg57CIFK/4xa6wEP/KlUZXWIxk7e/rKDsMN1PW4mRlXiDuex/Nf0Uo2SSqEOVZ+GQTZ8YTFhLfTopMya3TzSzSHbImQ9GaHxGme+u+f16fwBAoh8RBtPBJx3aY/EJ4yT6Ytd1lMobJyQJdIR7m/Ftkp5aiCp6Ke09kkmaRUH5x3TeHxMZoIUolBmbtgSFPaltsOA+vtqHpt2HyfYvAVH4BZp3nkxa2hNQlSj0gHmqyir0ZFEt3ZAvdHBx8cF1skV+9M1STjca8FlW7di6fsagW+qMEv38rumIVn8xYitK1DrVkOWoxIRlisgq4wAccHqFAVoKalkWD2fQJkwSx5CkP0IazjsYV0bVd68UlEmPVkjU1kdQkJusDM0Rh8YE65P8+oUBWlpoxi4ZJ6hOACz5lY39ox0uFyTIzveJQOY4J5JBziS2hiixa03/IK0o5cZ5Gv9J0lxN6BHlj7/0d+oR2lyRCJtBPTvtv+vsw+ZEw+P2IVbL2puCQElmSEEtccEmKG7JAHgxF3R6vM1kktNvNogGVW6vMRp7mZfDPbFEen3LKnK0/RvOUyaLljtXTclJOHDBVqzNZ7KIBXZajOPagVrQf/tnjoFM8ajvFfKdHw+pu/uSq7bApfrwfr71RQ5blCKrpI9iIL67yQNYnOpNFlqPos9AJjU+7Kit3wf9S6a+BRpfrXOoaNz7REqbsRWshnwvUkJUMe+DaRdk41NRDN7y0Wl+y8MfDRsqQ9Yh62QHPfGS++5dwvjvsYFsSWZnKoWg9LmE/y5VQJovWdNZOZtYmWbKazuCIX33JqkKcDHW3Q2mLqp1PUcA6bCAL0ARI22TlYZjexk748LC8RrD2JmEhtBKh0drsPVn5aE44CFcNwNPlDTKigy22HnbRz5uVRAeVksMmd4sz+6qYDqm0fqEIthcko78tlLU/JKreh/Bwnki+h//PrUMlvCfrPFp9giTfq3w5qVB6+HgjUCGUZvmy7Ddiokq7g7WeC3z8Ek1xVDxYiNoNbmk2NNinUbHitGuJOu/JEtS0LFNW3al7ey5Qo+5M9nJB+cQIt1sVFKrQoZGAtRv3LiSTL6R1HJVwQlksqOTW3hTs9JasqgJuVWw1ErcqJC2rAMcWXpzVpG/LIlsV6LIJBu1tQKa3XYCiQc12Qa+x0BKOz2kJZbJQuc8ctCaLeMya27bwi3JIaLtd1zHLwyYY92EHjzodup1U3I60abNEmz6IWlyjQIdOukJKHMDatCJZVIc+QMpdSSLatJSTeHj3tXm6zoYt7rdXuRWd2mZRpUNzbdokkBAs7mWKRLZAATreqkgW1aEL2ILoOFa2t82AZb9q0pEsi4eNe7qNU2Us/VS6kkakTS9GOnSqSIeWlpCSpVTTpRw5subC5LJqHcnCZtL/76bDZmNYh47jgVIlQm2aaDV2gQ5NSxSg1pLhDVkZ+FK+IKtNSzkpgsnyeB3JWuRhszHmYXTylBod2sxDTps+Lc07yheoxtq0Z7JouTPxwprctaylepKF4xwe0mGDRKxD76DpHTLatAn+axDq0PtFthuLMlmWI8KakDa9fZUMJ7GwwjONOpK13NMGiZEx6Gy2Ch2apuW0aRkd2oWHD5A2neyZLKpD03R2IqpJyslKpIbus+pHVjrZelOHTV3xAjlF67HpgIsOLSphf5eUkJK10kxhZXVoUU3zi4RyVjyWs0yflND+ucjlLjlazMoNxLPjDkOwpOW9Di32S5StFGrTptpskQ4tLpGUKSWLTgLILZafJK7pJNGmpRK8ae0GK0uWSFpfrNJhQbXoX+mwETWnQ1M40QR4XsFHJrhHcx0qISFLgIQpnA5NYdnD1TRZePGZTVZeABMiXq0rjG5ErbDFeaUXOvRFqS91NvKlUm26AibXrKAySx1MfynjfZU6WeMELQvVNFtaU32mq5M1rmzpse+Sa1ycrEIsVudkpVuc/9XDJ7AepzHLyk57p2h+FHre7SgJhMt67FKHer7YfS+CNV86uti52tPpoGQRue+FyJF13/u2eT4zwPg4ilBwuNvjBz+Mz+6waMa2rEjjUzLeYCfxVXjCvcaXIF0/UhTl+SN02LbcDMIe+PNXExQ+QzcSXbQThD3wMpSnvfpkX9jHlnr3yb7IN42PQXIfgxzfw/jMqNefGR3BKOFO4wO20C3l5Qdsu7xoLAAm0ZEvdTE+uu31R7cfYJRxg/E59/+2d3c/TWRRAMBvASlYWAQjbgRRV0BDV3aR3WAw4seKCa4lIlT8wPqxFCjMCQnZhraEVsBKhLbBDZIou/qybIzsA6D7AgLLAwm+6T7CH+LrMudWRtGGaTvTzszt7xnmJie3d845984M/Zx7BhHhPP+naxzD3vERqCFifAO8AMesTgzAfiKGrpHxR4DxPPdlHRGlhO3sgeYNh4k42yz8X49yjPJgP3kb2Zqwy+P6i2PSgIvu6ohlsDKcmDqwLDQQ0U7i1BrgGNSLE6uKiLejldn3+OBp7pYsQsKdWsMcc4Zxa/UECUemldGdi2VcsbaudD7/ZJFziGPMPSf9LFF4DM1MpvGYvDeHNbHoY8AM7rf+DfQx33Cl3eT/7y1TfS37c3yNQzoJmxGjPMkxZAzoq8XCl1SPu2IPOWY8xOeaGpJIBAqAscwU89GOfBKRGmzVdHKMCGBr5hyJTE4LS2u8fRXz0R0kQj8A70+OCQtAt3QildyAefwDjgEPMHc3p5CI7cFXkM1zDFjD7a+vSRROAH2OQPPeAO84iYb+Ov4QBzmN68cfYZOeRGV/B3+VVY0f2Op5jSnWPhKlk8BAZ2sZaC85Wqlm0PzZhyfAa9STqOW2Yo2o4RbzkA/77ruIBL7DuLs1u2x1u4G+IV8KOhNo+jMEK8Cr1RFJZFrwcvc5TZoE3o0MIpG8Nsy2NNl/CGCGZcsnkjmC0b+rwS3q3jmgrwWR0E90ke/hNKaHLu7VREr6erzojNZ6W33AM0uQYX1s5x0tNplHgXc7h0gsvxUv/ILTkEXgtRUQyRVjSe3VUN3T5cXyuYjI4EfgOUc4jRhxAj3jJ4tTNFoaeXTzHxfwThN5pNTi5V2aOCLfSWNlSiYy0V/EAWb7OdX71Qe8ujQim/QGHMKn+mj101jVpxMZGRpxkKWnnKoFZoF3RbLq+csyrtB1S9UHt54uAe/aV0Rm2TdotFScQYzQtb1pB5Fd9jWaQag2O+2i+dXVGMRqvRd4GQfzqrTyGfPS7YksEhOGS4A8auxBPAJ6H5R5bRek19ERZ1TX3+oeB3TJQGImrZaO6VbZl9h63YBMEjewtqh8TtNR76qq9AnMAa0HZatxQihtpzfFMU417tPbYEcFibnCFkB+ley+2h2AWotJHOy9E1y4VLGzPxRcrm5LuOkVjhwzHd83wSnek1lADZL328VKPQOUX+E5RI/DC6g6prfBTYxtgF4r+q7YvwrIVkbiKs8CyLmg3HR+0QnIkkfiLLMWqDWFngB/sAaUKWYVTmg6ozU4uR4pMImwv3EBailLIkqwywzUquIaqIG3QDXmEoVIreoA5B1V1BN3D38P3gQ7qlKJcuy/DpTvP8Us9PYxH1DXoj6zLS19ZTtQbxWyCfvUDZStSsb9rgjtMUNQnwLeJnVvHIIadhMFSim3AuX0xLlcHPb8C5T1+1i3Y8TKOtuhhHANOJwQdCGbKNfe9S1ryuWI0wnUAYcLgurj1GEQK+nQzY1w+eOQ0z8TQnW7VKm/QEH6sWYI8o7H+DR457j3w9i/VCjvHvglhuNW+OBdV8zyLnvXu41hrZUx3L6JNlyVQrh8jmdcDAwtTG0M2XYqk6hJVlUzfOCdfilzid39ct67MVzzCdkPfEhue7kFNsyuvJLt52h/tTIrjGQ5up2o0bZDl0Ew65elDur0/AaCq6VKqpjDoztQYwPB1PITSZv1PX8sT4HAVnNAoufg4iWjtBE+4pxfkCideLb4mE/UhUlVEZMzRDLTFZzj742Cub7FQXtUq9Tgiz5+Sgms1QUqn1SCtOKfW+ETS4/fj/RyEegdef/Y9em1Ws8XqyMBFS39sMkGm/jmRycDPaJXqMDk6Lxv8zXaLhyS9chxvGwvOsMXjp+FzN3nWJwYHO4OkUMND04sOvrcQpgEljNFmowUpdtdftEGIbjmnk/PjPv9Hsc6j98/PjP9fM4V6q9tF4/mamadCkmfX3bhDkSlua7yoIan1CbJuUfOmm2RxKnNfPbbXOX3XiSXkltcaWpqFxum9iZTZfGuFMKylJx9Jceq667cag8Ro1uNddXHSvblsB2mzQw78w4WFhmNpWXrSo3GosKDeTvV05dKSEhISEhISPjE/76DQ0jDO9jgAAAAAElFTkSuQmCC';
                    }
                    //If it's a static resource internal url
                    if(imageUrl.startsWith("/resource") || imageUrl.startsWith('resource')){
                        if(imageUrl.charAt(0) != '/'){
                            imageUrl = '/' + imageUrl;
                        }
                        imageUrl = sitePrefix.concat(imageUrl);
                    }
                    imagesList.push({
                        title:  response[i].Name,
                        url:    imageUrl,
                        value:  response[i].Saved_value__c,
                        desc:   response[i].Image_Description__c
                    });
                }
                component.set('v.staticResourceZipImagefiles', imagesList);
                component.set('v.showSpinner', false);
               // console.log(imagesList);
               // console.log('-- helper.getSwipeyImages -- End -- ');
                this.handleSelectPreferences(component, event, helper);
            },
            {
                category: component.get('v.imageCategory')
            }
        );
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