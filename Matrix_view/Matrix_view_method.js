class Matrix_view(){
  Liste_axis=[];
  Matrix=[[]]
  constructor(liste){
    for (var i in liste) {
      Liste_axis.append(i);
      for (let j in Liste_axis[i]){
        Matrix[i].append(i);
      }
    };
  }

  get_axe(axis){
    return Matrix[axis];
    // renvoit la colonne "axis" de la matrice.
  }

  change_axis(pos_ini,pos_final){
    let tmp = Liste_axis[pos_ini];
    Liste_axis.splice(pos_ini,1);
    calcul(pos_ini);
    if (pos_ini>pos_final) {
      Liste_axis.splice(pos_final,0,tmp);
    }
    if (pos_ini<pos_final){
      Liste_axis.splice(pos_final-1,0,tmp);
    }
    calcul(pos_final-1);
    calcul(pos_final);
    Liste_modified();
  }

  supprimer_axis(axis){
    for (let i=0; i<len(Liste_axis);i++){
      if (Liste_axis[i]==axis){
        Liste_axis.splice(i,1);
        calcul(i);
        calcul(i+1);
        Liste_modified();
        break;
      }
    }
  }

  Liste_modified(){
    return Liste_axis;
  }

  calcul(index){
    // Algorithme de calcul à l'indice index en fonction des indices index - 1 et index + 1
  }

  affichage_matrix(){

  }

  inverser_axe(axis){

  }

  taille_groupe(axis){

    for (let i=0; i<len(Matrix_view[axis]); i++){

    }
  }

}

class Axes(){
  Liste_0=[];
  Liste_1=[];
  Liste_2=[];
}

class line(){
  constructor(dir){
    // direction = up, middle ou down
    direction=dir;

  }
}

// Groupes sur les axes changent-ils ?
