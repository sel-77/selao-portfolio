/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {
	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');	// Sound effects elements
	var pageOpenSound = document.getElementById('pageOpenSound');
	var pageCloseSound = document.getElementById('pageCloseSound');

	// Volume settings - adjust these to balance the sounds
	var pageOpenVolume = 0.65;   // Page open sound volume (0.0 to 1.0)
	var pageCloseVolume = 0.25; // Page close sound volume (0.0 to 1.0)

	// Check if audio files are loaded
	var soundsReady = false;
	
	// Initialize sound effects
	function initializeSounds() {
		if (pageOpenSound && pageCloseSound) {
			// Set volumes programmatically
			pageOpenSound.volume = pageOpenVolume;
			pageCloseSound.volume = pageCloseVolume;
			
			// Check if audio files can be loaded
			pageOpenSound.addEventListener('canplaythrough', function() {
				console.log('Page open sound loaded successfully');
			});
			
			pageOpenSound.addEventListener('error', function(e) {
				console.log('Page open sound file not found or failed to load. Sound effects disabled.');
			});
			
			pageCloseSound.addEventListener('canplaythrough', function() {
				console.log('Page close sound loaded successfully');
			});
			
			pageCloseSound.addEventListener('error', function(e) {
				console.log('Page close sound file not found or failed to load. Sound effects disabled.');
			});
			
			soundsReady = true;
		}
	}

	// Sound effect functions
	function playPageOpenSound() {
		if (pageOpenSound && soundsReady) {
			try {
				pageOpenSound.currentTime = 0;
				var playPromise = pageOpenSound.play();
				if (playPromise !== undefined) {
					playPromise.catch(function(error) {
						console.log('Page open sound play failed (audio files may be missing):', error);
					});
				}
			} catch (error) {
				console.log('Page open sound error:', error);
			}
		}
	}

	function playPageCloseSound() {
		if (pageCloseSound && soundsReady) {
			try {
				pageCloseSound.currentTime = 0;
				var playPromise = pageCloseSound.play();
				if (playPromise !== undefined) {
					playPromise.catch(function(error) {
						console.log('Page close sound play failed (audio files may be missing):', error);
					});
				}
			} catch (error) {
				console.log('Page close sound error:', error);
			}
		}
	}

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});
	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
				// Initialize sound effects
				initializeSounds();
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;
		// Function to update section indicator
		function updateSectionIndicator(id) {
			var sectionNames = {
				'projects': 'Projects',
				'work': 'Work Experience',
				'other': 'Other Relevant Involvements',
				'contact': 'Contact',
				'elements': 'Elements'
			};
			
			var $sectionName = $('#section-name');
			var displayName = sectionNames[id] || id.charAt(0).toUpperCase() + id.slice(1);
			$sectionName.text(displayName);
		}
		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Play page open sound effect
				if (typeof initial === 'undefined' || initial !== true) {
					playPageOpenSound();
				}

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();							// Activate article.
								$article.addClass('active');							// Update section indicator
							updateSectionIndicator(id);							// Update fast navigation and highlight first item
							setTimeout(function() {
								populateNavigation();
								// Reattach scroll listeners to ensure they work
								attachScrollListeners();
								// For immediate highlighting on page click
								var $currentArticle = $main_articles.filter('.active');
								if ($currentArticle.length > 0) {
									var $headings = $currentArticle.find('h2.major');
									if ($headings.length > 0) {
										var firstHeadingId = $headings.first().attr('id');
										updateActiveNavItem(firstHeadingId);
									}
								}
							}, 100);

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');										// Update section indicator
										updateSectionIndicator(id);										// Update fast navigation and highlight first item
										setTimeout(function() {
											populateNavigation();
											// Reattach scroll listeners to ensure they work
											attachScrollListeners();
											// For immediate highlighting on article switch
											var $currentArticle = $main_articles.filter('.active');
											if ($currentArticle.length > 0) {
												var $headings = $currentArticle.find('h2.major');
												if ($headings.length > 0) {
													var firstHeadingId = $headings.first().attr('id');
													updateActiveNavItem(firstHeadingId);
												}
											}
										}, 100);

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Update section indicator
										updateSectionIndicator(id);

										// Update fast navigation
										setTimeout(populateNavigation, 100);

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Play page close sound effect
				playPageCloseSound();

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');							// Deactivate article.
								$article.removeClass('active');

							// Hide fast navigation
								$fastNav.removeClass('visible');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;				// Deactivate article.
					$article.removeClass('active');

				// Hide fast navigation
					$fastNav.removeClass('visible');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};
		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Don't add close button to individual articles anymore
				// The global close button will handle this

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Global Close Button
			var $globalClose = $('#global-close');
			
			$globalClose.on('click', function() {
				location.hash = '';
			});
		// Events.
			$body.on('click', function(event) {

				// Don't hide article if clicking on fast navigation
				if ($(event.target).closest('#fast-nav').length > 0) {
					return;
				}

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}
		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

		// Mouse parallax effect for background
		var mouseMoveHandler = function(e) {
			// Get mouse position relative to viewport
			var mouseX = e.clientX;
			var mouseY = e.clientY;
			
			// Get viewport dimensions
			var viewportWidth = window.innerWidth;
			var viewportHeight = window.innerHeight;
			
			// Calculate position as percentage from center (-0.5 to 0.5)
			var xPercent = (mouseX / viewportWidth) - 0.5;
			var yPercent = (mouseY / viewportHeight) - 0.5;
			
			// Apply subtle movement (adjust multiplier for more/less effect)
			var moveX = xPercent * 30; // 30px max movement
			var moveY = yPercent * 30; // 30px max movement
			
			// Update CSS custom properties
			document.documentElement.style.setProperty('--bg-x', moveX + 'px');
			document.documentElement.style.setProperty('--bg-y', moveY + 'px');
		};

		// Add mouse move listener
		document.addEventListener('mousemove', mouseMoveHandler);
		// Fast Navigation Functionality
			var $fastNav = $('#fast-nav'),
				$navList = $('#nav-list');

			// Function to populate navigation based on current article
			function populateNavigation() {
				$navList.empty();
				
				// Get the currently visible article
				var $currentArticle = $main_articles.filter('.active');				if ($currentArticle.length > 0) {
					// Find all h2 elements in the current article
					var $headings = $currentArticle.find('h2.major');
					
					if ($headings.length > 0) {
						$headings.each(function(index) {
							var $heading = $(this);
							var headingText = $heading.text();
							var headingId = 'heading-' + index;
							
							// Add ID to heading if it doesn't have one
							if (!$heading.attr('id')) {
								$heading.attr('id', headingId);
							} else {
								headingId = $heading.attr('id');
							}
							
							// Create navigation item
							var $navItem = $('<li class="section-item"></li>');
							var $navLink = $('<a href="#' + headingId + '">' + headingText + '</a>');
							
							$navItem.append($navLink);
							$navList.append($navItem);
							
							// Add click handler
							$navLink.on('click', function(e) {
								e.preventDefault();
								e.stopPropagation(); // Prevent homepage navigation
								scrollToHeading(headingId);
							});
						});
								// Show fast navigation
						$fastNav.addClass('visible');
						
					} else {
						// Hide fast navigation if no headings
						$fastNav.removeClass('visible');
					}
				} else {
					// Hide fast navigation when no article is active
					$fastNav.removeClass('visible');
				}
			}

			// Function to scroll to heading within article
			function scrollToHeading(headingId) {
				var $target = $('#' + headingId);
				if ($target.length > 0) {
					var $article = $target.closest('article');
					if ($article.hasClass('scrollable-projects')) {
						// For scrollable articles, scroll within the article
						var targetPosition = $target.position().top + $article.scrollTop() - 20;
						$article.animate({
							scrollTop: targetPosition
						}, 500);
					} else {
						// For regular articles, just scroll to top
						$article.scrollTop(0);
					}
					
					// Update active state immediately
					updateActiveNavItem(headingId);
				}
			}

			// Function to update active navigation item
			function updateActiveNavItem(activeId) {
				$navList.find('a').removeClass('active');
				$navList.find('a[href="#' + activeId + '"]').addClass('active');
			}			// Function to check which heading is currently visible
			function updateActiveHeading() {
				var $currentArticle = $main_articles.filter('.active');
				
				if ($currentArticle.length > 0 && $currentArticle.hasClass('scrollable-projects')) {
					var $headings = $currentArticle.find('h2.major');
					var scrollTop = $currentArticle.scrollTop();
					var articleHeight = $currentArticle.outerHeight();
					var scrollHeight = $currentArticle.prop('scrollHeight');
					var activeHeading = null;
					
					// Check if we're at the bottom of the scrollable content
					var isAtBottom = (scrollTop + articleHeight >= scrollHeight - 10);
					
					if (isAtBottom && $headings.length > 0) {
						// If at bottom, highlight the last heading
						activeHeading = $headings.last().attr('id');
					} else {
						// Find the currently visible heading
						$headings.each(function() {
							var $heading = $(this);
							var headingTop = $heading.position().top + scrollTop;
							
							if (headingTop <= scrollTop + 100) {
								activeHeading = $heading.attr('id');
							}
						});
					}
					
					if (activeHeading) {
						updateActiveNavItem(activeHeading);
					}
				}
			}// Listen for article changes
			$main.on('keydown', function(e) {
				// Update navigation after article change
				setTimeout(populateNavigation, 100);
			});			// Function to attach scroll listeners to scrollable articles
			function attachScrollListeners() {
				// Remove existing listeners first
				$main_articles.filter('.scrollable-projects').off('scroll.fastNav');
				
				// Attach scroll listeners to all scrollable articles
				var $scrollableArticles = $main_articles.filter('.scrollable-projects');
				$scrollableArticles.on('scroll.fastNav', function() {
					updateActiveHeading();
				});
			}

			// Initial attachment of scroll listeners
			attachScrollListeners();

			// Prevent fast navigation clicks from bubbling to body
			$fastNav.on('click', function(event) {
				event.stopPropagation();
			});

			// Initial population when page loads
			setTimeout(populateNavigation, 500);

})(jQuery);