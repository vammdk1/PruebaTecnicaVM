namespace PruebaTecnicaVM;

static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        string port = "8080";
        String url = "http://localhost";
        

        ApplicationConfiguration.Initialize();
        Application.Run(new Form1(port, url));
    }    
}