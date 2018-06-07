var questionnaire = {
    numPage: 0,
    nbQuestions: 999,
    nbPages: 999,
    type: 'aucun',
    reponses : {}
};

$('#message').hide();

function getQuestions(quizz){
    $.ajax({
        url: 'enquete.php',
        type: 'POST',
        dataType: 'json',
        data: {page: quizz.numPage},
        success: function (data) {
            var q = '';
            var i = 0;
            questionnaire.nbQuestions = Object.keys(data.questions).length;
            questionnaire.type = data.type;

            console.log(questionnaire);
            console.log(data);

            $('h3').html(data.title);

            for( i = 0; i < questionnaire.nbQuestions; i++){
                q += '<h4>' + data.questions[questionnaire.numPage + '.' + (i + 1) ] + '</h4>';
                switch(data.type){
                    case ('boolean'):
                        q += '<label></label><input type="radio" name="rep' + questionnaire.numPage + '_' + (i + 1) +'" id="rep' + (i + 1) + 'oui" value="1"/>OUI</label>' +
                            '<label></label><input type="radio" name="rep' + questionnaire.numPage + '_' + (i + 1) +'" id="rep' + (i + 1) + 'non" value="2"/>NON</label>';
                        break;
                }
            }
            $('#questions').html(q);
            getReponses(questionnaire);

        }
    })
}

function setReponses(quizz){
    switch (quizz.type){
        case('boolean'):
            $(':radio').each(function () {
                questionnaire.reponses[$(this)[0].name] = [0, quizz.numPage];
            });
            $(':checked').each(function(){
                questionnaire.reponses[$(this)[0].name][0] = $(this).val();
            });
            break;
    }
}

function getReponses(quizz){
    var i = 0;

    for(i = 0 ; i < quizz.nbQuestions; i++){
        switch(quizz.type){
            case ('boolean'):
                    if(quizz.reponses['rep' + quizz.numPage + '_' + (i + 1)][0] === 1){
                        $('#rep' +(i + 1) + 'oui').prop('checked', true);
                    }
                if(quizz.reponses['rep' + quizz.numPage + '_' + (i + 1)][0] === 2){
                    $('#rep' + (i + 1) + 'non').prop('checked', true);
                }
                break;
        }
    }
}

function update(quizz){
    if(quizz.numPage === quizz.nbPages){
        $('#next').prop('disabled', true);
        $('#confirm').prop('disabled', false);
    } else {
        $('#next').prop('disabled', false);
        $('#confirm').prop('disabled', false);
    }
    getQuestions(quizz);
}

function nbPage(quizz){
    $.ajax({
        url: 'enquete.php',
        type: 'POST',
        dataType: 'json',
        data: {length: 4},
        success: function (data) {
            quizz.nbPages = data.length;
        }

    })
}



$('#next').on('click', {QUEST: questionnaire}, function(e){
    e.data.QUEST.numPage++;
    setReponses(e.data.QUEST);
    update(e.data.QUEST);
});

$('#confirm').on('click', {QUEST: questionnaire}, function(e){
    setReponses(e.data.QUEST);
    update(e.data.QUEST);
});

questionnaire.numPage = 1;
nbPage(questionnaire);
update(questionnaire);