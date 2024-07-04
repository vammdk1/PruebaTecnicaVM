using System.Security.Policy;
using System.Text;
using System.Text.Json;

namespace PruebaTecnicaVM;

public partial class Form1 : Form
{
    private string port;
    private string url;
    private TextBox notas = new TextBox();
    private Label label = new Label();
    private int num = 1;

    public Form1(string port, string url)
    {
        //datos de conexion
        this.port = port;
        this.url = url;
        //dimensiones botones
        int size_X = 100;
        int size_Y = 80;
        //espacio entre botones
        int space_X = 20;

        //Espacio de texto
        int spaceT_X = size_X + 50;

        //posiciones de inicio
        int x = 20;
        int y = 20;

        InitializeComponent();
        ComprobarConexion();
        misNotas(x, y, spaceT_X);
        misBotones(x, y, size_X, size_Y, space_X);
    }

    private async void ComprobarConexion()
    {
        string fullurl = $"{url}:{port}/status";
        using (HttpClient client = new HttpClient())
        {
            try{
                //comprobar conexion
                HttpResponseMessage response = await client.GetAsync(fullurl);
            }
            catch (HttpRequestException)
            {
                //mostrar mensaje de error
                MessageBox.Show("No se ha podido establecer conexión con el servidor");
                //cerrar aplicacion si no hay conexion
                Application.Exit();
            }  
        }
    }

    private void misNotas(int x ,int y, int space)
    {
        //titulo 1
        Label label1 = new Label();
        label1.Text = "Introduce texo a alamcenar:";
        label1.Location = new Point(x + space, y);
        label1.Size = new Size(200, 20);
        this.Controls.Add(label1);

        //Espacio de texto
        notas = new TextBox();
        notas.Location = new Point(x + space, y + label1.Height + 1);
        notas.Size = new Size(200, 200);
        notas.Multiline = false;
        this.Controls.Add(notas);

        //titulo 2
        Label label2 = new Label();
        label2.Text = "Texto almacenado:";
        label2.Location = new Point(x + space, notas.Location.Y + notas.Height + 10);
        label2.Size = new Size(200, 20);
        this.Controls.Add(label2);

        //Texto almacenado
        label = new Label();
        label.Location = new Point(x + space, label2.Location.Y + label2.Height + 1);
        label.Size = new Size(200, 200);
        label.BackColor = Color.White;
        this.Controls.Add(label);
      
    }

    private void misBotones(int x, int y, int size_X, int size_Y, int space)
    {
        Button save = new Button();
        Button read = new Button();
        Button delete = new Button();

        save.Text = "Guardar nota";
        read.Text = "Leer nota";
        delete.Text = "Eliminar nota";

        save.Location = new Point(x, y);
        save.Size = new Size(size_X, size_Y);

        read.Location = new Point(x, save.Location.Y + size_Y + space);
        read.Size = new Size(size_X, size_Y);

        delete.Location = new Point(x, read.Location.Y + size_Y + space);
        delete.Size = new Size(size_X, size_Y);

        save.Click += new EventHandler(save_Click);
        read.Click += new EventHandler(read_Click);
        delete.Click += new EventHandler(delete_Click);

        this.Controls.Add(save);
        this.Controls.Add(read);
        this.Controls.Add(delete);
    }

    private async void save_Click(object? sender, EventArgs e)
    {
        string texto = notas.Text;
        string fullurl = $"{url}:{port}/save";
        using (HttpClient client = new HttpClient())
        {
            //enviar texto
            var content = new StringContent($"{{ \"num\": \"{num}\", \"nota\": \"{texto}\" }}", Encoding.UTF8, "application/json");
    
            //recibir respuesta
            HttpResponseMessage response = await client.PostAsync(fullurl, content);
            if (!response.IsSuccessStatusCode)
            {
                //si error mostrar mensaje
                MessageBox.Show($"Error al enviar texto: {response.StatusCode}");
            }else
            {
                //limpiar espacio de texto
                notas.Text = "";
                num++;
            }
        }
    }

    private async void read_Click(object? sender, EventArgs e)
    {
        string fullurl = $"{url}:{port}/read";
        using (HttpClient client = new HttpClient())
        {
            HttpResponseMessage response = await client.GetAsync(fullurl);
            if (response.IsSuccessStatusCode)
            {
                //mostrar texto
                string texto = await response.Content.ReadAsStringAsync();
                
                // Deserializar el JSON
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Hace que la serialización sea insensible a mayúsculas y minúsculas
                };
                var notas = JsonSerializer.Deserialize<Nota[]>(texto, options);

                // Construir el texto para mostrar en el label
                string mensaje = "";
                foreach (var nota in notas)
                {
                    mensaje += $"{nota.Nombre} : {nota.Datos}\n";
                }

                label.Text = mensaje;
            }
            else
            {
                //mostrar mensaje de error
                MessageBox.Show($"Error al leer texto: {response.StatusCode}");
            }
        }
    }

    private void delete_Click(object? sender, EventArgs e)
    {
        string fullurl = $"{url}:{port}/delete";
        using (HttpClient client = new HttpClient())
        {
            HttpResponseMessage response = client.DeleteAsync(fullurl).Result;
            if (!response.IsSuccessStatusCode)
            {
                //mostrar mensaje de error
                MessageBox.Show($"Error al eliminar texto: {response.StatusCode}");
            }
            else
            {
                //limpiar espacio de texto
                label.Text = "";
                num = 1;
            }
        }
    }

        public class Nota
    {
        public string? Nombre { get; set; }
        public string? Datos { get; set; }
    }
   
}
