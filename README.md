angularCrop
===========

Обрезка изображений на angularjs.

<h2>Подключение</h2>
<ol>
    <li>
        <h3>Подключаем:</h3>
        <pre>var app = angular.module('app', ['angularCrop']);</pre>
    </li>
    <li>
        <h3>В шаблоне:</h3>
        <pre>
&lt;div ng-init-crop crop-min-sizes="{'width': 122, 'height': 122}" crop-width="600" crop-height="480" crop-point="{'top': 10, 'left': 10, 'width': 142, 'height': 142, 'ratio': true}" id="crop" result="cords"&gt;
   &lt;img src="img/12.jpg" width="600" height="480" alt=""/&gt;
&lt;/div&gt;
&lt;div id="result"&gt;
    &lt;input type="text" value="{{cords.x1}}" /&gt;
    &lt;input type="text" value="{{cords.y1}}" /&gt;
    &lt;input type="text" value="{{cords.x2}}" /&gt;
    &lt;input type="text" value="{{cords.y2}}" /&gt;
    &lt;input type="text" value="{{cords.width}}" /&gt;
    &lt;input type="text" value="{{cords.height}}" /&gt;
&lt;/div&gt;
        </pre>
        <b>cropMinSizes</b> - минимальные размеры выделяемой области.<br />
        <b>cropWidth</b> - ширина рабочей области (может изменяться динамически).<br />
        <b>cropHeight</b> - высота рабочей области (может изменяться динамически).<br />
        <b>point</b> - стартовая позиция выделенной области, если параметр <b>ratio</b> равен <b>true</b>, то высота и ширина выделенной области изменяются пропорционально.</br>
        <b>result</b> - в него будут выводиться результат работы директивы (координаты верхнего левого угла, нижнего правого угла, высота и длина выделенной области).

    </li>
    <li>
        <h3>Поддержка:</h3>
        IE9 и выше, Chrome, Opera, Firefox, Safary;
    </li>
</ol>
<hr />
angularCrop
===========

Module to angularjs for selecting a rectangular area of an image.

<ol>
    <li>
        <h3>Installation:</h3>
        <pre>var app = angular.module('app', ['angularCrop']);</pre>
    </li>
    <li>
        <h3>In template:</h3>
        <pre>
&lt;div ng-init-crop sizes="{width: 600, height: 480}" id="crop" result="cords"&gt;
   &lt;img src="img/12.jpg" width="600" height="480" alt=""/&gt;
&lt;/div&gt;
&lt;div id="result"&gt;
    &lt;input type="text" value="{{cords.x1}}" /&gt;
    &lt;input type="text" value="{{cords.y1}}" /&gt;
    &lt;input type="text" value="{{cords.x2}}" /&gt;
    &lt;input type="text" value="{{cords.y2}}" /&gt;
    &lt;input type="text" value="{{cords.width}}" /&gt;
    &lt;input type="text" value="{{cords.height}}" /&gt;
&lt;/div&gt;
        </pre>
        <b>cropMinSizes</b> - minimum sizes for select area.<br />
        <b>cropWidth</b> - width work area (can dynamically change).<br />
        <b>cropHeight</b> - height work area (can dynamically change).<br />
        <b>point</b> - start cords for select area, if parameter <b>ratio</b> is <b>true</b>, when height and width select area change in proportion.</br>
        <b>result</b> - object to display the results.
    </li>
    <li>
        <h3>Support:</h3>
        IE9 and above, Chrome, Opera, Firefox, Safary;
    </li>
</ol>