if (typeof (SiebelAppFacade.ContactFormAppletTalkingPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.ContactFormAppletTalkingPR");
    define("siebel/custom/ContactFormAppletTalkingPR", ["siebel/phyrenderer"], function () {
        SiebelAppFacade.ContactFormAppletTalkingPR = (function () {

            function ContactFormAppletTalkingPR(pm) {
                SiebelAppFacade.ContactFormAppletTalkingPR.superclass.constructor.apply(this, arguments);
            }

            SiebelJS.Extend(ContactFormAppletTalkingPR, SiebelAppFacade.PhysicalRenderer);

            ContactFormAppletTalkingPR.prototype.Init = function () {
                SiebelAppFacade.ContactFormAppletTalkingPR.superclass.Init.apply(this, arguments);
            }

            ContactFormAppletTalkingPR.prototype.CustomTalkingScript = () => {

                $("#LabelForScript_Label").parent().after("<div id='talking_script_div' class='flex-box-script'><div><ul><br><br> 1. Приветствие</ul><ul><p>2. Поздравление с важной датой/<br>благодарность за сотрудничество</p></ul><ul><button id='Custom_but_talk_1' title='Предложение' class='Custom-Button-talking'>  3. Предложение</button></ul><br> <ul><button id='Custom_but_talk_2' title='Решение'  class='Custom-Button-talking'>  4. Решение</button></ul><ul><br> 5. Прощание</ul></div></div><div class='space-div-custom'></div>");

                let onClickFirstButton1 = document.querySelector('#Custom_but_talk_1');
                let onClickSecondButton2 = document.querySelector('#Custom_but_talk_2');

                let URL1 = 'https://clck.ru/MDyqK';
                let URL2 = 'https://clck.ru/MDyqw';

                onClickFirstButton1.onclick = () => {
                    alert('UPS! Something go wrong!');
                    window.open(URL1, 'Google', 'width=800,height=600');
                }

                onClickSecondButton2.onclick = () => {
                    alert('UPS! Something go wrong!');
                    window.open(URL2, 'Google', 'width=800,height=600');
                }

                //в ES6 если функция возвращает 1 выражение, фигурные скобки можно не писать
                onClickFirstButton1.onmouseenter = () => onClickFirstButton1.className = "Custom-Button-talking-click";
                onClickFirstButton1.onmouseleave = () => onClickFirstButton1.className = "Custom-Button-talking";

                onClickSecondButton2.onmouseenter = () => onClickSecondButton2.className = "Custom-Button-talking-click";
                onClickSecondButton2.onmouseleave = () => onClickSecondButton2.className = "Custom-Button-talking";
            }

            ContactFormAppletTalkingPR.prototype.BottomCustomAppletStyle = () => {

               let bottomCustomButton1 = document.querySelector('#text-button-1');
               let bottomCustomButton2 = document.querySelector('#text-button-2');
               let bottomCustomButton3 = document.querySelector('#text-button-3');
               let bottomCustomButton4 = document.querySelector('#text-button-4');
               let bottomCustomButton5 = document.querySelector('#text-button-5');
               let bottomCustomButton6 = document.querySelector('#text-button-6');
               let bottomCustomButton7 = document.querySelector('#text-button-7');

               bottomCustomButton1.textContent="Просмотр обслуживания";
               bottomCustomButton2.textContent="Назначить встречу в ДО";
               bottomCustomButton3.textContent="Дистанционные заявки";
               bottomCustomButton4.textContent="Территория обслуживания";
               bottomCustomButton5.textContent="Региональная сеть";
               bottomCustomButton6.textContent="Ближайшие банкоматы";
               bottomCustomButton7.textContent="Журнал жалоб";

            }


            ContactFormAppletTalkingPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.ContactFormAppletTalkingPR.superclass.BindData.apply(this, arguments);

                this.CustomTalkingScript();
                this.BottomCustomAppletStyle();
            }



            return ContactFormAppletTalkingPR;
        }());
        return "SiebelAppFacade.ContactFormAppletTalkingPR";
    })
}