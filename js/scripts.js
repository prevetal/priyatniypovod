const getCssVar = (el, name) => {
    const val = getComputedStyle(el).getPropertyValue(name).trim(),
    	num = parseFloat(val)

    return isNaN(num) ? val : num
}


const setHeight = (items) => {
	let maxheight = 0

	items.forEach(el => {
		if (el.offsetHeight > maxheight) maxheight = el.offsetHeight
	})

	items.forEach(el => el.style.height = maxheight + 'px')
}


document.addEventListener('DOMContentLoaded', function() {
	// Product thumbs slider
	const productThumbsSliders = [],
		productThumbsSlider = document.querySelectorAll('.product .images .swiper')

	productThumbsSlider.forEach((el, i) => {
		el.classList.add('product_thumbs_s' + i)

		let options = {
			loop: true,
			// loopAdditionalSlides: 1,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			lazy: true,
			pagination: {
				el: el.querySelector('.swiper-pagination'),
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			spaceBetween: getCssVar(el, '--spaceBetween'),
			slidesPerView: getCssVar(el, '--slidesPerView'),
		}

		const swiperInstance = new Swiper('.product_thumbs_s' + i, options)
		productThumbsSliders.push(swiperInstance)

		// Hover
		const slidesCount = el.querySelectorAll('.swiper-slide').length

		if (slidesCount > 1) {
			const nav = document.createElement('div')
			nav.className = 'hover-nav'

			for (let j = 0; j < slidesCount; j++) {
				const cell = document.createElement('span')

				cell.dataset.index = j

				nav.appendChild(cell)
			}

			el.appendChild(nav)

			nav.addEventListener('mouseover', (e) => {
				const cell = e.target.closest('span')
				if (!cell) return

				swiperInstance.slideToLoop(+cell.dataset.index, 500)
			})

			const product = el.closest('.product')

			product.addEventListener('mouseleave', () => {
				swiperInstance.slideToLoop(0, 0)
			})
		}
	})


	// Products small slider
	const productsSmallSliders = [],
		productsSmallSlider = document.querySelectorAll('.products_small .swiper')

	productsSmallSlider.forEach((el, i) => {
		el.classList.add('products_small_s' + i)

		let options = {
			loop: false,
			// loopAdditionalSlides: 1,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			lazy: true,
			navigation: {
				nextEl: el.querySelector('.swiper-button-next'),
				prevEl: el.querySelector('.swiper-button-prev')
			},
			spaceBetween: getCssVar(el, '--spaceBetween'),
			slidesPerView: getCssVar(el, '--slidesPerView'),
			on: {
				init: swiper => {
					setTimeout(() => {
						setHeight(swiper.el.querySelectorAll('.product'))

						$(swiper.el).find('.swiper-button-next, .swiper-button-prev').css(
							'top', $(swiper.el).find('.thumb').outerHeight() * 0.5
						)
					})
				},
				resize: swiper => {
					let items = swiper.el.querySelectorAll('.product')

					items.forEach(el => el.style.height = 'auto')

					setTimeout(() => {
						setHeight(items)

						$(swiper.el).find('.swiper-button-next, .swiper-button-prev').css(
							'top', $(swiper.el).find('.thumb').outerHeight() * 0.5
						)
					})
				}
			}
		}

		productsSmallSliders.push(new Swiper('.products_small_s' + i, options))
	})


	// Product info
	if ($('.product_info .images').length) {
		const productImages = document.querySelector('.product_info .big .swiper'),
			productThumbs = document.querySelector('.product_info .thumbs .swiper')

		const productThumbsSlider = new Swiper('.product_info .thumbs .swiper', {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			direction: 'vertical',
			lazy: true,
			spaceBetween: getCssVar(productThumbs, '--spaceBetween'),
			slidesPerView: getCssVar(productThumbs, '--slidesPerView'),
			navigation: {
				nextEl: productThumbs.closest('.thumbs').querySelector('.swiper-button-next'),
				prevEl: productThumbs.closest('.thumbs').querySelector('.swiper-button-prev')
			},
		})

		new Swiper('.product_info .big .swiper', {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: getCssVar(productImages, '--spaceBetween'),
			slidesPerView: getCssVar(productImages, '--slidesPerView'),
			lazy: true,
			thumbs: {
				swiper: productThumbsSlider
			},
			navigation: {
				nextEl: productImages.querySelector('.swiper-button-next'),
				prevEl: productImages.querySelector('.swiper-button-prev')
			},
		})
	}


	// Zoom images
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false
		},
		Thumbs: {
			autoStart: false
		}
	})


	// Custom select - Nice select
	const selects = document.querySelectorAll('select:not(.skip)'),
		selectsInstances = []

	if (selects) {
		selects.forEach(el => {
			selectsInstances.push(NiceSelect.bind(el, {
				placeholder: el.getAttribute('data-placeholder')
			}))

			el.addEventListener('change', () => el.classList.add('selected'))

			if (el.querySelector('option[selected]')) {
				el.classList.add('selected')
			}
		})
	}


	// Dialog
	$(document).on('click', '[data-open-modal]', function(e) {
		e.preventDefault()

		document.getElementById($(this).data('modal')).showModal()
	})

	$(document).on('click', '[data-close-modal]', function() {
		$(this).closest('dialog')[0].close()
	})

	$(document).on('click', '.modal', function(e) {
		if (!$(e.target).closest('.inner').length) {
			this.close()
		}
	})


	// Product to favorite
	$('.product .favorite_btn, .product_info .favorite_btn').click(function(e) {
		e.preventDefault()

		$(this).toggleClass('active')
	})


	// Filter
	$('.filter .name').click(function(e) {
		e.preventDefault()

		$(this)
			.toggleClass('active')
			.next('.data')
			.slideToggle(300)
	})


	$('.filter .spoler_btn').click(function(e) {
		e.preventDefault()

		const data = $(this).closest('.data')

		$(this).toggleClass('active')

		data.find('.hidden')
			.slideToggle(100)
	})


	const priceRange = $('#price_range').ionRangeSlider({
		type: 'double',
		min: 0,
		max: 100000,
		from: 10000,
		to: 35000,
		step: 100,
		onChange: data => {
			$('.filter .price_range input.from').val(data.from.toLocaleString('ru-RU') + ' ₽')
            $('.filter .price_range input.to').val(data.to.toLocaleString('ru-RU') + ' ₽')

			$('.filter .submit_btn').prop('disabled', false)
		},
	}).data('ionRangeSlider')

	$('.filter .price_range .input').keyup(function () {
		priceRange.update({
			from: parseInt($('.filter .price_range .input.from').val().replace(/\s|₽/g, '')),
			to: parseInt($('.filter .price_range .input.to').val().replace(/\s|₽/g, '')),
		})
	})


	$('.filter .checkbox input').change(function() {
		$('.filter .submit_btn').prop('disabled', false)
	})


	$('.filter .reset_btn, .filter_selected .clear_all_btn').click(function(e) {
		e.preventDefault()

		if (priceRange) { priceRange.reset() }

		$('.filter_selected .btn').remove()
		$('.filter_selected').removeClass('show')

		$('.filter form').get(0).reset()
	})
})