on run
    set scriptPath to POSIX path of (path to me)
    set projectPath to do shell script "dirname " & quoted form of scriptPath
    
    tell application "Terminal"
        activate
        do script "cd " & quoted form of projectPath & " && ./start-with-browser.sh"
    end tell
end run