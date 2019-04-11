Reaction_list=[]
fic=open("donnees.mat","r")
header=0
numero_ligne=0
matrice={}
for ligne in fic.readlines():
    tmp=ligne.split()
    if header==0 :
        for i in tmp:
            Reaction_list.append(i)
            for i in Reaction_list :
                matrice[i]=[0,0,0,[]]
    if header==1:
        for i in range(len(tmp)) :
            entier=int(tmp[i])
            matrice[Reaction_list[i]][3].append(entier)
    numero_ligne+=1
    header = 1

for cle in matrice.keys():
    for i in matrice[cle][3] :
        if (i==0):
            matrice[cle][0]+=1
        if (i==1):
            matrice[cle][1]+=1

        if (i==2):
            matrice[cle][2]+=1

Matrix_view={}
for i in range(len(Reaction_list)) :
    Matrix_view[i]={}
    Matrix_view[i][Reaction_list[i]]=[]
    Matrix_view[i][Reaction_list[i]].append(matrice[Reaction_list[i]][0])
    Matrix_view[i][Reaction_list[i]].append(matrice[Reaction_list[i]][1])
    Matrix_view[i][Reaction_list[i]].append(matrice[Reaction_list[i]][2])

for cle in Matrix_view.keys():
    print (cle , Matrix_view[cle])