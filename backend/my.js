

function setupListener(){
    let button=document.getElementById('submit');
    button.addEventListener("click",doSubmit,);
    

}

function doSubmit(){
    
    let input=document.getElementById("input");
    console.log(input.files);
    const reader=new FileReader();
    reader.onload=function(){
        var lines=reader.result.split('\n').map(function(line){
            return line.split(' ');
        });
        
        console.log(lines);
        var fich_json=JSON.stringify(lines);
        
        let request=new XMLHttpRequest();
        request.open('POST'," http://localhost:3000/graphs");
        request.send(lines);
    }
    reader.readAsText(input.files[0]);

    

    
}



window.addEventListener("load",setupListener);