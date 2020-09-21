export class FormatName {
    public static formatNamesLists(data: string): string {
        let result = "";
        data = data.trim();
        data = data.replace("‐", "-");
        for(let i=data.length-1; i>=0; i--) {
            if(data[i] == '\'' && i>0) {
                switch(data[--i].toUpperCase()) {
                    case "A": {
                        result = "À" + result;
                        break;
                    }
                    case "E": {
                        result = "É" + result;
                        break;
                    }
                    case "I": {
                        result = "Ì" + result;
                        break;
                    }
                    case "O": {
                        result = "Ò" + result;
                        break;
                    }
                    case "U": {
                        result = "Ù" + result;
                        break;
                    }
                }
            } else {
                if(data[i] != '#')
                    result = data[i] + result;
                else
                    --i; 
            }
        }
        return result;
    }
}