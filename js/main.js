var enquete = {
    nbQuestions : 0,
    numPage : 1,
    type : 'aucun',
    reponses : {},
    allFill: false
};

function getQuestion(survey) {
    $.ajax({
        url: 'enquete.php',
        type: 'POST',
        dataType: 'json',
        data: {page: survey.numPage},
        success: function (data) {
            //console.log(data);
            var quest = '';
            enquete.type = data.type;
            enquete.nbQuestions = Object.keys(data.questions).length;

            $('.container h3').text(data.title);

            for(var i = 0; i < enquete.nbQuestions; i++){
                quest += '<h4>' + data.questions[enquete.numPage + '.' + (i + 1)] + '</h4>';
                switch(enquete.type){
                    case ('boolean'):
                        quest += '<label><input id="rep' + (i + 1) +'oui" type="radio" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="1" + disa>OUI</label>' +
                            '<label><input id="rep' + (i + 1) +'non" type="radio" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="2" + disa>NON</label>';
                        break;
                    case ('scale'):
                        quest += '<input type="range" name="rep' + (i + 1) + '" id="rep' + enquete.numPage + '_' + (i + 1) + '" min="0" max="5" scale="1" value="0" oninput="showValRange(this)">' +
                            '<div id="value_rep' + enquete.numPage + '_' + (i + 1) + '"></div>';
                        break;
                    case ('text'):
                        quest += '<input type="text" name="rep' + (i + 1) + '" id="rep' + enquete.numPage + '_' + (i + 1) + '"/>';
                        break;
                    case ('select'):
                        quest += '<select>' +
                            '<option id="rep' + enquete.numPage + '_' + (i + 1) + '_1" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="1">1</option>' +
                            '<option id="rep' + enquete.numPage + '_' + (i + 1) + '_2" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="2">2</option>' +
                            '<option id="rep' + enquete.numPage + '_' + (i + 1) + '_3" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="3">3</option>' +
                            '<option id="rep' + enquete.numPage + '_' + (i + 1) + '_4" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="4">4</option>' +
                            '<option id="rep' + enquete.numPage + '_' + (i + 1) + '_5" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="5">5</option>' +
                            '</select>';
                        break;
                    case('checkbox'):
                        quest += '<label><input id="rep' + (i + 1) + '_' + 1 +'" type="checkbox" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="PHP">PHP</label>' +
                            '<label><input id="rep' + (i + 1) + '_' + 2 +'" type="checkbox" name="rep' + enquete.numPage + '_' + (i + 1) +'" value="JS">JS</label>';
                        break;
                }
            }
            $('#questions').html(quest);
            if(enquete.allFill === true){
                $('input:not(#next, #confirm) , select').prop('disabled', true);
            }
            getReponse(enquete);
        }
    })
}

/**
 *
 * @param val
 * affiche la valeur de l'input range
 */
function showValRange(val){
    $('#value_' + val.id).text(val.value);
}

/**
 *
 * @param survey (enquete)
 * recupère les réponses et les stocke dans un objet reponses
 */
function setReponse(survey){
    var i = 0;
    switch(survey.type){
        case ('boolean'):
            $(':radio').each(function(){
                survey.reponses[$(this)[0].name] = ['0', survey.numPage];
            });
            $(':checked').each(function(){
                survey.reponses[$(this)[0].name][0] = $(this).val();
            });
            break;
        case ('scale'):
            for( i = 0; i < survey.nbQuestions; i++){
                survey.reponses['rep' + survey.numPage + '_' + (i + 1)] = [$('#rep' + survey.numPage + '_' + (i +1 )).val(), survey.numPage];
            }
            break;
        case ('text'):
            for( i = 0; i < survey.nbQuestions; i++){
                survey.reponses['rep' + survey.numPage + '_' + (i + 1)] = [$('#rep' + survey.numPage + '_' + (i +1 )).val(), survey.numPage];
            }
            break;
        case ('select'):
            $('select option').each(function(){
                survey.reponses[$(this)[0].attributes.name.value] = ['0', survey.numPage];
            });
            $(':selected').each(function(){
                survey.reponses[$(this)[0].attributes.name.value][0] = $(this).val();
            });
            break;
        case ('checkbox'):
            break;
    }
}

/**
 *
 * @param survey (enquete)
 * récupère les réponses dont on a déjà donné les réponses
 */
function getReponse(survey){
    for(var i = 0; i < survey.nbQuestions; i++){
        if(survey.reponses['rep' + survey.numPage + '_' + (i + 1)] !== undefined){
            switch(survey.type){
                case ('boolean'):
                    if(survey.reponses['rep' + survey.numPage + '_' + (i + 1)][0] === '1'){
                        $('#rep' + (i + 1) + 'oui').prop('checked', true);
                    } else if (survey.reponses['rep' + survey.numPage + '_' + (i + 1)][0] === '2'){
                        $('#rep' + (i + 1) + 'non').prop('checked', true);
                    }
                    break;
                case ('scale'):
                    $('#rep' + survey.numPage + '_' + (i + 1)).val(survey.reponses['rep' + survey.numPage + '_' + (i + 1)][0]);
                    break;
                case ('text'):
                    $('#rep' + survey.numPage + '_' + (i + 1)).val(survey.reponses['rep' + survey.numPage + '_' + (i + 1)][0]);
                    break;
                case ('select'):
                    $('#rep' + survey.numPage + '_' + (i + 1) + '_' + survey.reponses['rep' + survey.numPage + '_' + (i + 1)][0]).prop('selected', true);
                    break;
                case ('checkbox'):
                    console.log($('#rep' + survey.numPage + '_' + (i + 1)));
                    /*if($('#rep' + survey.numPage + '_' + (i + 1))[0][0] !== undefined){
                        $('#rep' + (i + 1) + '_1').prop('checked', true);
                    }
                    if($('#rep' + survey.numPage + '_' + (i + 1))[0][1] !== undefined){
                        $('#rep' + (i + 1) + '_2').prop('checked', true);
                    }*/
                    break;
            }

        }
    }
}

/**
 *
 * @param survey (enquete)
 * récupère le nombre de pages
 */
function nbPage(survey){
    $.ajax({
        async: false,
        url : 'enquete.php',
        type: 'POST',
        dataType: 'json',
        data: {length : 1},
        success: function(data){
            enquete.nbPage = data.length;
        }
    })
}

/**
 *
 * @param survey (enquete)
 * désactive le next si on est à la dernière question
 */
function update(survey){
    if(survey.numPage === survey.nbPage){
        $('#next').prop('disabled', true);
        $('#confirm').prop('disabled', false);
    } else{
        $('#next').prop('disabled', false);
        $('#confirm').prop('disabled', true);
    }
    getQuestion(enquete);
}

$('#next').on('click', {ENQ : enquete}, function(e){
    $('#message').hide();
    setReponse(e.data.ENQ);
    e.data.ENQ.numPage++;
    update(e.data.ENQ);
});

$('#confirm').on('click', {ENQ: enquete}, function(e){
    setReponse(e.data.ENQ);
    console.log(e.data.ENQ);

    for (rep in e.data.ENQ.reponses){
        if(e.data.ENQ.reponses[rep][0] === '0' || e.data.ENQ.reponses[rep][0] === ''){
            e.data.ENQ.numPage = e.data.ENQ.reponses[rep][1];
            $('#message').show();
            update(e.data.ENQ);
            return;
        }
    }

    //si tout est rempli
    e.data.ENQ.numPage = 1;
    e.data.ENQ.allFill = true;
    update(e.data.ENQ);
    $('.container').css('background-color', '#90EE90');
    $('#confirm').hide();
});

$('#message').hide();
nbPage(enquete);
update(enquete);