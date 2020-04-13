
$.getJSON("https://panteopro.github.io/data_1.json", function(json) {
    let data = json; // this will show the info it in firebug console
    


    let counter = 0
    let ul = document.createElement('ul')
    ul.setAttribute('class', 'graph-labels')

    let groups = 0
    data.forEach((game) => {
        if(counter == 15){
            counter = 0;
            groups++;
            ul = document.createElement('ul');
            ul.setAttribute('class', 'graph-labels')
            ul.setAttribute('id', "graph_"+groups)
            document.getElementsByClassName('wrapper')[0].appendChild(ul);
        }
        let label = document.createElement('li')
        let a = document.createElement('a')
        a.setAttribute('class', 'graph-label')
        let span = document.createElement('span')
    
        span.innerHTML = game['koef']

        a.appendChild(span)
        label.appendChild(a)

        let koef = parseFloat(game['koef'])

        if (koef <= 1.15)
            a.setAttribute('style', 'color: rgb(164, 43, 63)')
        if (koef > 1.15 && koef < 2)
            a.setAttribute('style', 'color: rgb(115, 85, 162)')
        if (koef >= 2 && koef < 4)
            a.setAttribute('style', 'color: rgb(247, 23, 244)')
        if (koef >= 4 && koef < 8)
            a.setAttribute('style', 'color: rgb(71, 177, 123)')
        if (koef >= 8 && koef < 30)
            a.setAttribute('style', 'color: rgb(249, 242, 36)')
        if (koef >= 30)
            a.setAttribute('style', 'color: rgb(14, 197, 229)')
        
        ul.appendChild(label)

        counter++;
        
    })




    document.getElementById('print').innerHTML += Math.round(data.length / 15)-1

    console.log(data)
});

let page = 1

const btn = document.getElementById('btn')
const btn_n = document.getElementById('btn_n')
const btn_b = document.getElementById('btn_b')


function change(page){
    document.getElementById('title').innerHTML = 'Номер текущей группы: ' + page
    wrapper = document.getElementsByClassName('wrapper')[0]
    wrapper.childNodes.forEach(function(elem){
        elem.setAttribute('style', 'display: none;')
    })
    document.getElementById('graph_'+page).setAttribute('style', 'display: flex;')

}

btn.addEventListener('click', function(event){
    page = parseInt(document.getElementById('txt').value, 10)
    change(page)
})

btn_n.addEventListener('click', function(event){
    page++
    change(page)
})

btn_b.addEventListener('click', function(event){
    page--
    if (page <= 0)
        page = 1
    change(page)
})