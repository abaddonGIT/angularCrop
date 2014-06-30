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
        Тут аттрибут <b>result</b> в него будут выводиться результат работы директивы (координаты верхнего левого угла, нижнего правого угла, высота и длина выделенной области).
        Аттрибут <b>sizes</b> принимает размеры рабочей области. В случаи если аттрибут не передан, директива сама попытается узнать размеры блока.
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
        <b>result</b> - object to display the results.
        <b>sizes</b> - size of the working area. If this attribute is empty, the directive itself will determine the size of the workspace.
    </li>
    <li>
        <h3>Support:</h3>
        IE9 and above, Chrome, Opera, Firefox, Safary;
    </li>
</ol>