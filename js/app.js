
var router = new Navigo(root = null, useHash=false);

// Finch.route(':license', function () {
//
//     console.log("Well hello there! How you doin'?!")
// }


// $.getJSON("../../data/file.json", function(json) {
//     console.log(json); // this will show the info it in firebug console
//     alert(json);
// });
//






var App = (function() {

    // Private variable for internal funtiions
    // and base valuse
    let _ = {

        // headers sent for backend api requests..
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        // Check response status for server errors or any other
        // validation, processing erros
        checkStatus: function (response) {
            console.log(response);

            // if response is between 200 - 300 then return response as it is
            // if the response is equal/above 400 then perform some certain tasks
            if (response.status >= 200 && response.status < 300)
                return response
            else  if (response.status == 422)
                response.json().then(_.handleValidationErrors);

            // Throw an exception to stop further code processing..
            throw new Error(response.statusText)
        },

        // Parse response data to conert json to javascript object..
        parseJSON: function (response) {
          return response.json()
        },

        // Handle any validation errros and display apropiate messages..
        // TODO: stop tab switch in case of erros...
        handleValidationErrors: function (errors) {

            // Loop through all errors and add them as error message after
            // each input element...
            $.each( errors, function( key, value ) {
                $('input[name=' + key + ']')
                    .parent()
                    .append('<p class="help-block validation-error text-danger">' + value[0] + '</p>')
                    .show('slow');
            });
            $('.validation-error').first().parent().find('input').focus();
        },

        beforeFilter: function (response) {

            // remove any validation errors if any exist
            $('.validation-error').hide('slow').remove();

            let returns =  _.checkStatus(response);
            return _.parseJSON(returns);
        },

        afterFilter: function (response) {
            var $active = $('.wizard .nav-tabs li.active');
                $active.next().removeClass('disabled');
                nextTab($active);
        },

        // Handle any skkipped expetion..v
        handleException: function (error) {
            console.log(error);
            console.log('Exception');
        },

        Config : function () {
            $.getJSON("/config.json", function(json) {

                _.User = json;
                console.log(json); // this will show the info it in firebug console
            });
        },

        Pages : (function() {

            return {
                License : function (request) {

                    console.log(_.User);

                    var Data = {};

                    if( request.params.startYear )
                    {
                        _.User.Year.Start = request.params.startYear;
                    }



                    $.get( '/licenses/' + request.params.lic + '.mst', function(template) {
                        var rendered = Mustache.render(template, _.User );
                        $('#content').html(rendered);
                    });

                    console.log(_.User);

                }
            }
        }())
    };
    return {

        // Make api requests to backend
        request : function (apiUrl, data, callback) {
            // User fetch() for making restfull api requests..
            fetch( apiUrl, {
                method: 'POST',
                headers: _.headers,
                body: JSON.stringify(data)
            })
            .then(_.beforeFilter)
            .then(callback)
            .then(_.afterFilter)
            .catch(_.handleException);
        },

        Initialize : function () {

            $.when( _.Config() ).then(function() {
                console.log( _.Pages);
                page( '/:lic/:startYear?/:endYear?',_.Pages.License)
                page()
            });




        }
    }
}());











// router
//   .on(':license', function (params) {
//
//       console.log(params);
//
//       var view = {
//           title: "Joe",
//           calc: function () {
//             return 2 + 4;
//           }
//         };
//
//         var output = Mustache.render("{{title}} spends {{calc}}", view);
//
//         $('#test').html(output);
//       console.log('testing');
//
//       $.get( '/' + param.license + '.mst', function(template) {
//           var rendered = Mustache.render(template, {name: "Luke", email:"im@msingh.me", year: "2015"});
//           $('#content').html(rendered);
//       });
//     // display all the products
//   })
//   .on(function (params) {
//       console.log(params)
//     })
//     .resolve();



App.Initialize();
