
import { findNeigbour, findNeigbourSpecific } from "./findNeighbour";
import getAllChildrenBetter from "./fixChildrenProblem";




const findProblemPage = ( resourceMeta, isStanding=true) => {

    let allPages = Array.from(document.querySelectorAll('.page-container'));



const defaultMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'div' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: `height: ${isStanding ? 1191: 842 }px; padding: 20px; width: ${isStanding ? 842: 1191 }px;  display: flex; flex-direction: column; box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);`, // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: 'CONTAINER' // Provide a value based on your application's logic
    };



    // Map each page to a tuple [sum of children heights, first child height]
    let maxHeight = isStanding ? 1150 : 842

    console.log("ALLPAGES: ", allPages, "MAXHEIGHT: ", maxHeight)
    let pageHeights = allPages.map(page => [
        Array.from(page.children).reduce((acc, child) => acc + child.offsetHeight, 0),
        page.children.length > 0 ? page.children[0].offsetHeight : 0
    ]);

    let nph = [...pageHeights]
    nph.shift()
    nph.push([null, null])
    const zip = (a, b) => a.map((k, i) => [k[0], b[i][1]]);
    let zipped = zip(pageHeights, nph)


    let pages = zipped.map(([sum, first]) => {
        console.log("SUM: ", sum, "FIRST: ", first, "pageheights: ", pageHeights, "nph", nph)
        if (sum + first < maxHeight && first != null && first > 90)
            
            return "short"
        //I literally don't know what else to do besides adding this 2000 one here...
        else if (sum > maxHeight )//&& sum < 2000 )
            return "long"
        else
            return "ok"    
    });
    let test = pages.findIndex(page => page == "short" || page == "long")
    console.log("PAGES: ", pages)
    if (test == -1)
        return [false,resourceMeta]

    
    let RM = [...resourceMeta]

    let pageNumber=0
    for (let p = 0; p < pages.length; p++) {
        console.log("PAGE: ", pages[p])


        let i = 0
        let page=-1
        while (i <= pageNumber){
            page = findNeigbourSpecific(page, RM, 'right', 'STOP', ['CONTAINER'])
            i++
        }
        let nextNeighbour = findNeigbourSpecific(page, RM, 'right', 'STOP', ['CONTAINER'])


        if (pages[p] == "long") {

            
            if (nextNeighbour == null) {
                let newPage = { ...defaultMeta }
                 //remove child from offender
                newPage.number_of_children = 1 //add child to new page
                let wholeChild = findNeigbourSpecific(RM.length - 1, RM, 'left', 'CONTAINER', ['DEFAULT']) //find the last child
                let actualChild= RM.slice(wholeChild, RM.length) //get the last child
                
                RM[page].number_of_children = RM[page].number_of_children -1//remove child from offender
                RM = RM.slice(0, wholeChild)
                RM.push(newPage)//add new page and remove child from old page
                RM=RM.concat(actualChild) //add child to new page

                

                
                console.log( "RM: ", RM, "NEWPAGE: ", newPage, "WHOLECHILD: ", wholeChild, "ACTUALCHILD: ", actualChild)
                return [true, RM]; 
            }
            else {
                let newPage = RM[nextNeighbour]
                RM[page].number_of_children = RM[page].number_of_children - 1 //remove child from offender
                newPage.number_of_children+= 1 //add child to new page
                let childStart = findNeigbourSpecific(nextNeighbour, RM, 'left', 'CONTAINER', ['DEFAULT']) //find the last child
                let actualChild= RM.slice(childStart, nextNeighbour) //get the last child
                
                let untilChild = RM.slice(0, childStart) //get the last child
                let afterChild = RM.slice(nextNeighbour+1, RM.length) //get the last child
                untilChild.push(RM[nextNeighbour])
                RM= untilChild.concat(actualChild).concat(afterChild)

                return [true, RM]; 
            }
             


        }
        if (pages[p] == "short") {

           
            let childStart = findNeigbourSpecific(nextNeighbour, RM, 'right', 'CONTAINER', ['DEFAULT']) //find the last child
            let childEnd= findNeigbourSpecific(childStart, RM, 'right', 'CONTAINER', ['DEFAULT']) //find the last child
            let container = RM[nextNeighbour]//remove child from offender
            container.number_of_children = container.number_of_children - 1 //remove child from offender
            RM[page].number_of_children = RM[page].number_of_children + 1 //add child to new page

            let beforeChild = RM.slice(0, nextNeighbour)
                 let actualChild = childEnd !=null? RM.slice(childStart, childEnd) : RM.slice(childStart)
            let afterChild = RM.slice(childEnd, RM.length) 
            console.log("Shorts", "CHILDSTART", childStart, "CHILDEND", childEnd)
            console.log("SHORTS", "RESOURCEMTA", resourceMeta)
            let RMcopy = beforeChild
            console.log("SHORTS", "RM", RMcopy)
            RMcopy= RMcopy.concat(actualChild)
            console.log("SHORTS", "RM", RMcopy, "ACTUALCHILD: ", actualChild)
            console.log("shorts, container", container)
            if (container.number_of_children > 0){
            RMcopy.push(container)
    
                RMcopy = RMcopy.concat(afterChild)
                     
            }
               console.log("SHORTS NO CHILDREN", "RM",RMcopy, )

              console.log("SHORTS", "RM",RMcopy, )
            console.log("SHORT", "RM",RM, "PAGES:  ", pages, "pageheights: ", pageHeights)
            console.log("SHORT", "RMcopy: ", RMcopy, "NEXTNEIGHBOUR: ", nextNeighbour, "CHILDSTART: ", childStart, "CHILDEND: ", childEnd, "BEFORECHILD: ", beforeChild, "AFTERCHILD: ", afterChild, "ACTUALCHILD: ", actualChild)

            return [true, RMcopy]


         }
        /*
        if (pages[p] == "empty") {
            RM.splice(-1)
            console.log("EMPTY", "RM", RM)
            return [false, RM]



         }
            */
            
        pageNumber++
    }
    
    //return (true, copy)
    


}

export default findProblemPage;