
//BUDGET CONTROLLER

var budgetController= (function(){
    
   var Expense= function(id,description,value){
       
       this.id=id;
       this.description=description;
       this.value=value;
       this.percentage=-1;
     };
    
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100)
        }
        else{
            this.percentage=-1;
        }
       
    };
    
    
    
    Expense.prototype.getPercentage=function(){
        
        return this.percentage;
    };
    
    var Income=function(id,description,value){
       
       this.id=id;
       this.description=description;
       this.value=value;
       
     };
    
    
    
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            
            sum += cur.value;
            
        });
        
        data.totals[type]=sum;
        
    };
    
    var data={
        
        allItems:{
            exp:[],
            inc:[]
        },
        
        totals:{
            exp:0,
            inc:0
        },
        
        budget:0,
        percentage:0
    }; 
    
    
    return{
        
        addItem: function(type,des,val){
          var newItem,ID;
            
            //create new Id
            //ID =last ID+1
            if (data.allItems[type].length > 0){
                ID=data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            
            else{
                ID=0;
            }
            
            //create new item based on 'inc' or 'exp'
            if(type==='inc'){
              newItem= new Income(ID,des,val) ;
                
            }
            else if(type==='exp')
              {
              newItem = new Expense(ID,des,val) ;
                
            }
            
            //push it into data structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
                  
        },
        
        
        deleteItem:function(type,id){
            
            var ids,index;
            ids=data.allItems[type].map(function(current){
                return current.id;
            });
            
            index=ids.indexOf(id);
            
            if(index!==-1){
                data.allItems[type].splice(index,1);
            }
            
            
        },
        
        
        
        calculateBudget :function(){
            
            //calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
            //calculate budget income -expenses
            data.budget=data.totals.inc-data.totals.exp;
            
            //calculate percentage of income that we spent
            if (data.totals.inc >0){
                
              data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);  
            }
            else{
                data.percentage= -1;
            }
            
            //
            
            
            
        
    },
        
        
        calculatePercentages:function(){
            
            
            data.allItems.exp.forEach(function(cur){
                
                cur.calcPercentage(data.totals.inc);
                
                
            });
            
            
            
        },
        
        getPercentages:function(){
            var allPerc=data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPerc;
            
        },
        
        getBudget: function(){
           return{
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage:data.percentage
                };
            
            
        },
        
        testing: function(){
            console.log(data);
             }
    };
    
})();


//UICONTROLLER

var UiController=(function(){
    
    
    var DomStrings={
        
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
        
    };
    
    
     var formatNumber=function(num,type){
            var numSplit,int,decimal;
            //  + or - based on type
            // exactly 2 decimal points
            //comma separating the thousands
            
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            int=numSplit[0];
            if(int.length>3){
               int=int.substr(0,int.length-3) +','+int.substr(int.length-3,3);
                
            }
            
            
            decimal=numSplit[1];
           
            return  (type=== 'exp' ? sign='-' :sign='+')+' '+int+'.'+decimal;
            
            
        };
    
    
    var nodeListForEach=function(list,callback){
                
                for(i=0;i<list.length;i++){
                    
                    callback(list[i],i);
                }
    };
    
    return{
        
        getInput: function(){
            
            return{
             type: document.querySelector(DomStrings.inputType).value,
             description: document.querySelector(DomStrings.inputDescription).value,
             value: parseFloat(document.querySelector(DomStrings.inputValue).value),
                
            };
             
        },
        
        
        addListItem : function(obj,type){
            //Create HTML string with placeholder text
            var html,newHtml,element;
            if(type==='inc'){
                 element=DomStrings.incomeContainer;
                 html=  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element=DomStrings.expensesContainer
               html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }
            
             //Replace the placeholder with some actual data
            
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
         
            //Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        
        deleteListItem:function(selectorID){
           var el= document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields : function(){
            var  fields,fieldsArr;
            fields=document.querySelectorAll(DomStrings.inputDescription+ ', '+DomStrings.inputValue);
            fieldsArr= Array.prototype.slice.call(fields)
            /*The slice() method returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included). The original array will not be modified.
            
            slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3)
            
            
            */
            
            fieldsArr.forEach(function(current,index,array){
                
                current.value="";
            });
            fieldsArr[0].focus();
            
        },
        
        displayBudget:function(obj){
             var type;
              obj.budget>0? type='inc':type='exp';
             document.querySelector(DomStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DomStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DomStrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
            
            if (obj.percentage>0){
                 document.querySelector(DomStrings.percentageLabel).textContent=obj.percentage+ '%';
            }
            
            else{
                 document.querySelector(DomStrings.percentageLabel).textContent='---';
            }
           
            
            },
        
        
        displarPerctages:function(percentages){
            var fields=document.querySelectorAll(DomStrings.expensesPercLabel);
            
        
            
            nodeListForEach(fields,function(current,index){
                
                if(percentages[index]>0){
                   current.textContent=percentages[index]+'%'; 
                }
                else{
                    current.textContent='---';
                }
                
            });
            
        },
        
        displayMonth:function(){
            var year,now,month;
            Months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now=new Date();
            year=now.getFullYear();
            month=now.getMonth();
            document.querySelector(DomStrings.dateLabel).textContent=Months[month]+' '+year;
            
        },
       
        changedType:function(){
            
           var fields=document.querySelectorAll(DomStrings.inputType+ ',' + DomStrings.inputDescription + ','+ DomStrings.inputValue ); 
            
            nodeListForEach(fields,function(cur){
                
                cur.classList.toggle('red-focus');
                
            });
            document.querySelector(DomStrings.inputBtn).classList.toggle('red');
            
        },
        
        getDomstrings: function(){
        return DomStrings;
    
    }
        
    };
    
})();



//GLOBAL APP CONTROLLER


var controller=(function(budgetCtrl,UiCtrl){
    
  
    var setupEventlisteners=function(){
        var DOM = UiCtrl.getDomstrings();
        
 document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAdditem);
  document.addEventListener('keypress',function(event){
        
        if(event.keyCode===13 || event.which===13){
            ctrlAdditem(); }
  });  
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UiCtrl.changedType);
        
 };
   
    
    
var updateBudget=function() {
    
          //1. calculate the budget
           budgetCtrl.calculateBudget();
          //2. Return budget 
    
           var budget=budgetCtrl.getBudget();
      
          //3. display the budget on the ui
           UiCtrl.displayBudget(budget);
    
    
            
}; 
    
var updatePercentages=function(){
    
    //1.calculate the percentages
    
    budgetCtrl.calculatePercentages();
    //2.read the percentages from the budget controller
    var percentages=budgetCtrl.getPercentages();
    //3.Update the UI with new percentages
    UiCtrl.displarPerctages(percentages);
    
    
};


      
var ctrlAdditem = function(){
         //1. get the input data
        var input,newItem;
      
        input = UiCtrl.getInput();
    
    
    if(input.description!=='' && !isNaN(input.value) && input.value>0){
      //2. add item to the controller
        newItem=budgetCtrl.addItem(input.type,input.description,input.value);
      
      //3. add item to the ui
      UiCtrl.addListItem(newItem,input.type);
    
      //4.clear the input fields
    
       UiCtrl.clearFields();
      //5.calculate and update budget
        updateBudget(); 
        
        //6.Calculate and update Percentages
        updatePercentages();
        
    }
      

        
    };
    
    var ctrlDeleteItem=function(event){
        
        //if(event.keyCode===13 || event.which===13){
         //   ctrlAdditem(); }
     var itemId,splitItem,ID;
    itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){
        splitItem=itemId.split('-');
            //split() returns an array with elements splited through '-'
        type=splitItem[0];
        ID=parseInt(splitItem[1]);
            
        }
        
        //1.Delete the item from data structures
        
        budgetController.deleteItem(type,ID);
        //2.Delete from UI
        UiCtrl.deleteListItem(itemId);
        //update and show the budget
        updateBudget(); 
        //6.Calculate and update Percentages
        
        updatePercentages();
    
  };  
      
      
return{
        
        init:function(){
        console.log('Application has started');
            UiCtrl.displayMonth();
        UiCtrl.displayBudget({
               budget: 0,
               totalInc: 0,
               totalExp: 0,
               percentage:-1
            
        })
        setupEventlisteners();
            
      }
 };
    
})(budgetController,UiController);
controller.init();
