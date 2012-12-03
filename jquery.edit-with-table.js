/*!
 * Original author: Alexandre Russel
 * Licensed under the MIT license
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
;
(function ($, window, document, undefined) {

    var pluginName = 'editWithTable',
        defaults = {
            firstHeaderName:"Name",
            tableClass:"",
            actionButtonClass:""
        };

    function EditWithTable(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.table = this.addTable();
    }

    EditWithTable.prototype = {
        addTable:function () {
            var table = this.createTable();
            $(this.element).before(table);
            return table;
        },
        createLine:function (value) {
            var _this = this;
            var line = $("<tr><td>" + value + "</td></tr>");
            var actionTd = $("<td></td>")
            var action = $("<button class='" + this.options.actionButtonClass + "'>Delete</button>");
            action.click(function () {
                line.remove();
                _this.updateValues();
                return false;
            });
            actionTd.append(action);
            line.append(actionTd);
            return line;
        },
        updateValues: function() {
           var values = ""
           this.table.find("tbody tr td:first-child").each(function(i, el) {
               values = values + (i == 0 ? "" : " ") + $(el).text();
           });
           $(this.element).val(values);
        },
        createTable:function () {
            var _this = this;
            var thead = $("<thead><td>" + this.options.firstHeaderName + "</td><td>Action</td></thead>");
            var tbody = $("<tbody></tbody>")
            var table = $("<table class='" + this.options.tableClass + "'></table>");
            table.append(thead);
            table.append(tbody);
            var values = $(this.element).val().split(" ");
            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                if(v != "") {
                  var line = this.createLine(v);
                  tbody.append(line);
                }
            }
            var inputText = $("<input type='text'/>")
            var addButton = $("<button class='" + this.options.actionButtonClass + "'>add</button>");
            addButton.click(function () {
                var v = inputText.val();
                var line = _this.createLine(v);
                tbody.append(line);
                inputText.val("");
                _this.updateValues();
                return false;
            });
            var addButtonTd = $("<td></td>");
            addButtonTd.append(addButton);
            var inputTextTd = $("<td></td>");
            inputTextTd.append(inputText);
            var lastLineTr = $("<tr></tr>");
            lastLineTr.append(inputTextTd);
            lastLineTr.append(addButtonTd);
            var tfoot = $("<tfoot></tfoot>");
            tfoot.append(lastLineTr);
            table.append(tfoot);
            return table;
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new EditWithTable(this, options));
            }
        });
    }
})(jQuery, window, document);