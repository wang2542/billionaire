(function ($) {
    "use strict";
    $("#icoAdmin")
        .icoAdminmenu({
            themelayout: 'vertical',
            verticalMenuplacement: 'left', // value should be left/right
            verticalMenulayout: 'wide', // value should be wide/box/widebox
            MenuTrigger: 'click',
            SubMenuTrigger: 'click',
            activeMenuClass: 'active',
            ThemeBackgroundPattern: 'pattern6',
            HeaderBackground: 'theme1',
            LHeaderBackground: 'theme1',
            NavbarBackground: 'theme1',
            ActiveItemBackground: 'theme0',
            SubItemBackground: 'theme1',
            ActiveItemStyle: 'style0',
            ItemBorder: false,
            ItemBorderStyle: 'solid',
            SubItemBorder: true,
            DropDownIconStyle: 'style1', // Value should be style1,style2,style3
            FixedNavbarPosition: true,
            FixedHeaderPosition: true,
            collapseVerticalLeftHeader: true,
            VerticalSubMenuItemIconStyle: 'style6', // value should be style1,style2,style3,style4,style5,style6
            VerticalNavigationView: 'view1',
            verticalMenueffect: {
                desktop: "shrink",
                tablet: "push",
                phone: "overlay",
            },
            defaultVerticalMenu: {
                desktop: "expanded", // value should be offcanvas/collapsed/expanded/compact/compact-acc/fullpage/ex-popover/sub-expanded
                tablet: "collapsed", // value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded
                phone: "offcanvas", // value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded
            },
            onToggleVerticalMenu: {
                desktop: "collapsed", // value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded
                tablet: "expanded", // value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded
                phone: "expanded", // value should be offcanvas/collapsed/expanded/compact/fullpage/ex-popover/sub-expanded
            },

        });
})(jQuery);

! function (e) {
    "use strict";

    function r() {
        e(".icoAdmin-inner-navbar a")
            .each(function () {
                this.href == window.location.href && (e(this)
                    .addClass("active"),
                    e(this)
                    .parent()
                    .addClass("icoAdmin-trigger"),
                    e(this)
                    .parent()
                    .parent()
                    .addClass("in"),
                    e(this)
                    .parent()
                    .parent()
                    .prev()
                    .addClass("active"),
                    e(this)
                    .parent()
                    .parent()
                    .parent()
                    .addClass("icoAdmin-trigger"),
                    e(this)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .addClass("in"),
                    e(this)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .addClass("icoAdmin-trigger"),
                    e(this)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .addClass("in"),
                    e(this)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .addClass("icoAdmin-trigger"))
            })
    }
    r()
}(jQuery);
