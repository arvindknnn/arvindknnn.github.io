/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

$(function() {

    /* Test suite for RSS Feeds */

    describe('RSS Feeds', function() {
        /* Test to make sure that
         * allFeeds variable has been defined and that it is not
         * empty. 
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* Test that ensures init function is defined
         */        

        it('app contains init function', function() {
            expect(init).toBeDefined();
            expect(typeof(init)).toBe("function");
        });

        /* Test that ensures loadFeed function is defined
         */        

        it('app contains loadFeed function', function() {
            expect(loadFeed).toBeDefined();
            expect(typeof(loadFeed)).toBe("function");
        });


        /* Test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */

        it('contain URLs', function() {
            allFeeds.forEach( function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBe('');

            });
        });


        /* Test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('contain Name', function() {
            allFeeds.forEach( function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBe('');

            });
        });
    });



    /* Test suite for slide menu */

    describe('The menu', function() {

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden by defalult', function() {
            expect($('body').hasClass("menu-hidden")).toBe(true);
        });

         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
          var menuIcon = $('.menu-icon-link');

          it('should display when it is hidden and menu icon is clicked', function() {
            if ($('body').hasClass("menu-hidden")) {
                menuIcon.trigger('click');
                expect($('body').hasClass("menu-hidden")).toBe(false);
            }
          });

          it('should hide when it is displayed and menu icon is clicked', function() {
            if (! $('body').hasClass("menu-hidden")) {
                menuIcon.trigger('click');
                expect($('body').hasClass("menu-hidden")).toBe(true);
            }
          });            
    });


    /* Test suite for Initial Entries in Feeds */

    describe('Initial Entries', function() {

        /* Test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         */  

        beforeEach(function(done) {
            loadFeed(0, done);
        });

        it('should have at least one record', function(done) {
            var entriesCnt = $(".entry").length;
            expect(entriesCnt).toBeGreaterThan(0);
            done();
        });
    });


    /* Test suite for Feed Change" */

    describe('New Feed Selection', function() {

        /* Test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         */       

        var firstEntry = $(".entry h2").eq(0).text();
        beforeEach(function(done) {                        
            loadFeed(1, done);
        });

        it('should have changed after calling loadFeed', function(done) {                        
            expect($(".entry h2").eq(0).text()).not.toEqual(firstEntry);
            done();
        });        
    });

}());
