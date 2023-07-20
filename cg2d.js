class Mapping
{
    constructor(Xwmin, Ywmin, Xwmax, Ywmax, Xsmin, Ysmin, Xsmax, Ysmax, isotropic=false)
    {
        this.Xwmin = Xwmin;
        this.Xwmax = Xwmax;
        this.Ywmin = Ywmin;
        this.Ywmax = Ywmax;

        this.Xsmin = Xsmin;
        this.Xsmax = Xsmax;
        this.Ysmin = Ysmin;
        this.Ysmax = Ysmax;


        /*
            larguraPixel = larguraCena/numeroPixels;

            numeroPixelsNaHorizontal = larguraCena/larguraPixel;
            numeroPixelsNaHorizontal = larguraRegiao/larguraPixel;

            O mesmo vale para a aultura.

            O pixel pode ser anisotrópico, quando larguraPixel != alturaPixel
            ou isotrópico quando larguraPixel = alturaPixel.

            Se quisermos forçar a isotropia,
            devemos pegar o maior tamanho de pixel, pois
            assim estaremos garantido pegar a menor quantidade de pixels
            considerando a altura e a largura.
        */
        this.pixelWidth = (Xwmax-Xwmin)/(Xsmax-Xsmin);
        this.pixelHeight = (Ywmax - Ywmin)/(Ysmax - Ysmin);
        
        if  (isotropic)
        {
            var ms = Math.max(this.pixelWidth, this.pixelHeight);
            this.pixelWidth = ms;
            this.pixelHeight = ms;
        }
    }

    xToSc(x)
    {
        return this.Xsmin + (x-this.Xwmin)/this.pixelWidth;
    }
    
    yToSc(y)
    {
        return this.Ysmin + ( this.Ysmax -  ((y - this.Ywmin)/this.pixelHeight) );
    }

    drawBorder(context, color="red")
    {
        context.beginPath()
        var st = context.style;
        context.strokeStyle = color;
        context.moveTo(this.Xsmin, this.Ysmin);
        context.lineTo(this.Xsmax, this.Ysmin);
        context.lineTo(this.Xsmax, this.Ysmax);
        context.lineTo(this.Xsmin, this.Ysmax);
        context.lineTo(this.Xsmin, this.Ysmin);
        context.stroke();
        context.strokeStyle = st;
    }

    drawLine(context, x1, y1, x2, y2)
    {
        console.log(this.xToSc(x1) + ", " + this.yToSc(y1) + " ::: " + this.xToSc(x2) + ",  " + this.yToSc(y2));
        context.beginPath();
        context.moveTo(this.xToSc(x1), this.yToSc(y1));
        context.lineTo(this.xToSc(x2), this.yToSc(y2));
        context.stroke();
    }
}

function desenharCirculo(context, m, c, raio, amostras=100)
{
    context.beginPath();
    var delta = (2 * Math.PI)/amostras;
    var ang = 0;
    var fx = 0;
    var fy = 0;
    for (var i = 0; i < amostras; i++)
    {
        var xi = c[0] + raio * Math.cos(ang);
        var yi = c[1] + raio * Math.sin(ang);
        ang += delta;
        if (i == 0)
        {
            context.moveTo(m.xToSc(xi), m.yToSc(yi));
            fx = xi;
            fy = yi;
        }
        else
        {
            context.lineTo(m.xToSc(xi), m.yToSc(yi));
        }
    }
    context.lineTo(m.xToSc(fx), m.yToSc(fy));
    context.stroke();
}

class Vector2D 
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    sum(vector) 
    {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    sub(vector)
    {
        return new Vector2D(this.x - vector.x, this.x - vector.y);
    }

    dot(v)
    {
        return this.x * v.x + this.y * v.y;
    }

    det(v)
    {
        this.x * v.y - this.y * v.x;
    }
}

class Vector3D 
{
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    sum(vector) 
    {
        return new Vector3D(this.x + vector.x, this.y + vector.y, this.z - vector.z);
    }

    sub(vector)
    {
        return new Vector3D(this.x - vector.x, this.x - vector.y, this.z - vector.z);
    }

    dot(v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
}

class Point2D
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;       
    }

    sum(vector) 
    {
        return new Point3D(this.x + vector.x, this.y + vector.y);
    }

    sub(point)
    {
        return new Vector2D(this.x - point.x, this.y - point.y);
    }
}


class Point3D
{
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;       
        this.z = z;
    }

    sum(vector) 
    {
        return new Point3D(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    sub(point)
    {
        return new Vector3D(this.x - point.x, this.y - point.y, this.z - point.z);
    }
}


class Lines2
{
    constructor(p1, p2)
    {
        this.begin = p1;
        this.end = p2;
    }
}

class Matrix2
{
    constructor(data = null)
    {
        if (data == null)
        {
            this.data = [[1, 0], [0, 1]];
        }
        else
        {
            this.data = [[0, 0], [0, 0]];
            for (var i = 0; i < data.length; i++)
            {
                for (var j = 0; j < data[i].length; j++)
                {
                    this.data[i][j] = data[i][j]; 
                }
            }    
        }
    }

    multP(p)
    {
        return new Point2D(this.data[0][0] * p.x + this.data[0][1] * p.y,
                            this.data[1][0] * p.x + this.data[1][1] * p.y);  
    }

    multV(v)
    {
        return new Vector2D(this.data[0][0] * v.x + this.data[0][1] * v.y,
            this.data[1][0] * v.x + this.data[1][1] * v.y);  
    }

    mult(m)
    {
        return new Matrix2([ [this.data[0][0] * m.data[0][0] + this.data[0][1] * m.data[1][0],
                           this.data[0][0] * m.data[0][1] + this.data[0][1] * m.data[1][1]],
                           [this.data[1][0] * m.data[0][0] + this.data[1][1] * m.data[1][0],
                           this.data[1][0] * m.data[0][1] + this.data[1][1] * m.data[1][1]] ])
    }
}


class Matrix3
{
    constructor(data = null)
    {
        if (data == null)
        {
            this.data = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }
        else
        {
            this.data = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            for (var i = 0; i < data.length; i++)
            {
                for (var j = 0; j < data[i].length; j++)
                {
                    this.data[i][j] = data[i][j]; 
                }
            }    
        }
    }

    multP(p)
    {
        return new Point3D(this.data[0][0] * p.x + this.data[0][1] * p.y + this.data[0][2] * p.z,
                            this.data[1][0] * p.x + this.data[1][1] * p.y + this.data[1][2] * p.z,
                            this.data[2][0] * p.x + this.data[2][1] * p.y + this.data[2][2] * p.z,);  
    }

    multV(v)
    {
        return new Vector3D(this.data[0][0] * v.x + this.data[0][1] * v.y + this.data[0][2] * v.z,
            this.data[1][0] * v.x + this.data[1][1] * v.y + this.data[1][2] * v.z,
            this.data[2][0] * v.x + this.data[2][1] * v.y + this.data[2][2] * v.z);  
    }

    mult(m)
    {
        let a = this.data;
        let b = m.data;
        return new Matrix3([[a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
                           a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
                           a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]],
                           [a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
                           a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
                           a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]],
                           [a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
                           a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
                           a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]]]
                           )
    }
}

class Circle
{
    constructor(x, y, r)
    {
        this.x = x;
        this.y = y;
        this.radio = r;
        this.origin = new Point3D(0, 0, 1);
        this.model = new Matrix3([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        this.resolution = 3;
    }

    render()
    {
        let delta = (2*Math.PI)/(this.resolution);
        let ang = delta;
        let x = this.origin.x +  Math.cos(ang) * this.radio;
        let y = this.origin.y +  Math.sin(ang) * this.radio;
        let first = new Point2D(x, y);
        let begin = new Point2D(x, y);
        let lines = []
        for (var i = 1; i < this.resolution; i++)
        {
            let x = this.origin.x +  Math.cos(ang) * this.radio;
            let y = this.origin.y + Math.sin(ang) * this.radio;
            ang += delta;
            let end = new Point3D(x, y, 1);
            lines.push(new Lines2(begin, end));
            begin = end;
        }
        let end = first;
        lines.push(new Lines2(end, begin));
        return lines;
    }
}


class Triangle
{
    constructor(x1, y1, x2,  y2, x3, y3)
    {
        this.p1 = new Point3D(x1, y1, 1);
        this.p2 = new Point3D(x2, y2, 1);
        this.p3 = new Point3D(x3, y3, 1);
        this.origin = new Point3D(0, 0, 1);
        this.model = new Matrix3([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    }

    render()
    {
        return [new Lines2(this.p1, this.p2), new Lines2(this.p2, this.p3), new Lines2(this.p3, this.p1)];
    }
}

class Window
{
    constructor(ctx, xmin, ymin, xmax, ymax)
    {
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
        this.origin = new Point3D(0, 0, 0);
        this.mapping = new Mapping(xmin, ymin, xmax, ymax, 0, 0, ctx.canvas.width, ctx.canvas.height, true);
        //this.orientation =  new Matrix2([[0.707, -0.707], [0.707, 0.707]]);
        this.orientation =  new Matrix3([[1, 0, 0], [0, 1, 0], [0, 0, 1]]); 
        this.objects = [];
        this.context = ctx;
    }

    toWindow(p, obj)
    {
        var tp1 = obj.origin
        var tp2 = this.orientation.mult(obj.model).multP(p);
        return tp1.sum(tp2);
    }

    draw()
    {
        for (var i = 0; i < this.objects.length; i++)
        {
            let obj = this.objects[i];
            let lines = obj.render();
            for (var j = 0; j < lines.length; j++)
            {
                let line = lines[j]
                let p1 = this.toWindow(line.begin, obj);
                let p2 = this.toWindow(line.end, obj);
                this.mapping.drawLine(this.context, p1.x, p1.y, p2.x, p2.y);
            }
        }
        this.mapping.drawBorder(this.context);
    }
}

function rotate(theta)
{
    r = theta * Math.PI/180.0
    c = Math.cos(r)
    s = Math.sin(r)
    return new Matrix3([[c, -s, 0], [s, c, 0], [0, 0, 1]])
}

function translate(dx, dy)
{
    return new Matrix3([[1, 0, dx], [0, 1, dy], [0, 0, 1]])
}

function scale(sx, sy)
{
    return new Matrix3([[sx, 0, 0], [0, sy, 0], [0, 0, 1]])
}

function shear(sx, sy)
{
    return new Matrix3([[1, sx, 0], [sy, 1, 0], [0, 0, 1]])
}





