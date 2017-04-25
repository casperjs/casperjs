using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;

interface engine {
    string env_varname();
    string default_exec();
    string[] native_args();
    string[] native_args_with_space();
}

class phantomjs : engine {
    public string env_varname() {
        return "PHANTOMJS_EXECUTABLE";
    }
    public string default_exec() {
        return "phantomjs";
    }
    public string[] native_args() {
        return new [] {
            "cookies-file",
            "config",
            "debug",
            "disk-cache",
            "disk-cache-path",
            "ignore-ssl-errors",
            "load-images",
            "load-plugins",
            "local-url-access",
            "local-storage-path",
            "local-storage-quota",
            "offline-storage-path",
            "offline-storage-quota",
            "local-to-remote-url-access",
            "max-disk-cache-size",
            "output-encoding",
            "proxy",
            "proxy-auth",
            "proxy-type",
            "remote-debugger-port",
            "remote-debugger-autorun",
            "script-encoding",
            "script-language",
            "ssl-protocol",
            "ssl-ciphers",
            "ssl-certificates-path",
            "ssl-client-certificate-file",
            "ssl-client-key-file",
            "ssl-client-key-passphrase",
            "web-security",
            "webdriver",
            "webdriver-logfile",
            "webdriver-loglevel",
            "webdriver-selenium-grid-hub",
            "wd",
            "w",
        };
    }
    public string[] native_args_with_space() {
        return new []{""};
    }
}

class slimerjs : engine {
    public string env_varname() {
        return "SLIMERJS_EXECUTABLE";
    }
    public string default_exec() {
        // use bat file on windows
        return (Path.DirectorySeparatorChar == '/') ? "slimerjs" : "slimerjs.bat";
    }
    public string[] native_args() {
        return new [] {
            "P",
            "jsconsole",
            "CreateProfile",
            "profile",
            "error-log-file",
            "user-agent",
            "viewport-width",
            "viewport-height",
            //phantomjs options
            "cookies-file",
            "config",
            "debug",
            "disk-cache",
            "ignore-ssl-errors",
            "load-images",
            "load-plugins",
            "local-storage-path",
            "local-storage-quota",
            "local-to-remote-url-access",
            "max-disk-cache-size",
            "output-encoding",
            "proxy",
            "proxy-auth",
            "proxy-type",
            "remote-debugger-port",
            "remote-debugger-autorun",
            "script-encoding",
            "ssl-protocol",
            "ssl-certificates-path",
            "web-security",
            "webdriver",
            "webdriver-logfile",
            "webdriver-loglevel",
            "webdriver-selenium-grid-hub",
            "wd",
            "w",
        };
    }
    public string[] native_args_with_space() {
        return new []{
            "--createprofile",
            "--profile",
            "-P",
            "-profile",
            "--private-window",
            "--UILocale",
            "--new-window",
            "--new-tab",
            "--search",
            "--recording",
            "--recording-output"
        };
    }
}

class casperjs {
    static int Main(string[] args) {
        var SUPPORTED_ENGINES = new Dictionary<string, engine> {
            {"phantomjs", new phantomjs()},
            {"slimerjs", new slimerjs()}
        };

        string ENGINE = Environment.GetEnvironmentVariable("CASPERJS_ENGINE")
                ?? "phantomjs";
        var ENGINE_ARGS = new List<string>();
        string _ENGINE_FLAGS = Environment.GetEnvironmentVariable("ENGINE_FLAGS")
                ?? null;
        if(_ENGINE_FLAGS != null) {
          ENGINE_ARGS.Add(_ENGINE_FLAGS);
        }
        string[] ENGINE_NATIVE_ARGS = {};
        string ENGINE_EXECUTABLE = "";

        string EXE_FILE = System.Reflection.Assembly.GetCallingAssembly().Location;
        var CASPER_ARGS = new List<string>();
        string CASPER_PATH = Path.GetFullPath(Path.Combine(Path.Combine(EXE_FILE, ".."), ".."));

        foreach(string arg in args) {
            if(arg.StartsWith("--engine=")) {
                ENGINE = arg.Substring(9);
                break;
            }
        }

        if(SUPPORTED_ENGINES.ContainsKey(ENGINE)) {
            ENGINE_NATIVE_ARGS = SUPPORTED_ENGINES[ENGINE].native_args();
            ENGINE_EXECUTABLE = Environment.GetEnvironmentVariable(SUPPORTED_ENGINES[ENGINE].env_varname())
                    ?? Environment.GetEnvironmentVariable("ENGINE_EXECUTABLE")
                    ?? SUPPORTED_ENGINES[ENGINE].default_exec();
        } else {
            Console.Error.WriteLine("Bad engine name. Only phantomjs and slimerjs are supported");
            Environment.Exit(1);
        }

        Regex arg_regex = new Regex("^--([^=]+)(?:=(.*))?$");
        
        foreach(string arg in args) {
            bool found = false;
            Match arg_match = arg_regex.Match(arg);
            if (arg_match.Success) {
                string arg_name = arg_match.Groups[1].Captures[0].ToString();
                foreach(string native in ENGINE_NATIVE_ARGS) {
                    if (arg_name == native) {
                        ENGINE_ARGS.Add(arg);
                        found = true;
                    }
                }
            }

            if(!found)
                if(!arg.StartsWith("--engine="))
                    CASPER_ARGS.Add(arg);
        }

        var ENGINE_EXEC = new List<string>(new [] {ENGINE_EXECUTABLE});
        var ENGINE_FILE = ENGINE_EXEC[0];
        ENGINE_EXEC.RemoveAt(0);

        var CASPER_COMMAND = new List<string>(ENGINE_EXEC);
        CASPER_COMMAND.AddRange(ENGINE_ARGS);
        CASPER_COMMAND.AddRange(new [] {
            @"""" + Path.Combine(Path.Combine(CASPER_PATH, "bin"), "bootstrap.js") + @"""",
            @"--casper-path=""" + CASPER_PATH + @"""",
            "--cli"
        });
        CASPER_COMMAND.AddRange(CASPER_ARGS);

        ProcessStartInfo psi = new ProcessStartInfo();
        psi.FileName = ENGINE_FILE;
        psi.UseShellExecute = false;
        psi.RedirectStandardOutput = true;
        psi.Arguments = String.Join(" ", CASPER_COMMAND.ToArray());

        try {
            Process p = Process.Start(psi);
            while (!p.StandardOutput.EndOfStream) {
                string line = p.StandardOutput.ReadLine();
                Console.WriteLine(line);
            }
            p.WaitForExit();
            return p.ExitCode;
        } catch(Win32Exception e) {
            Console.Error.WriteLine("Fatal: " + e.Message + "; did you install " + ENGINE + "?");
            return -1;
        }
    }
}
